defmodule TrelloBurndown.Trello do
  import IEx
  alias TrelloBurndown.HttpRequest

  @raw_label_map %{
    SMALL: 1,
    MEDIUM: 2,
    LARGE: 4,
    EXTRA_LARGE: 8
  }

  def get_full_board(board_id, secret) do
    case get_board(board_id, secret) do
      {:ok, board} ->
        case get_labels_for_board board_id, secret do
          {:ok, labels} ->
            points = calculate_points_from_labels(labels)

            board = Map.put(board, :points, points)
              |> Map.put(:labels, labels)

            {:ok, board}

          value -> value
        end
      value -> value
    end
  end

  def get_board(board_id, secret) do
    {:ok, data} = get("/board/#{board_id}", secret)

    if (is_map data) do
      sprint_name = Regex.run(~r/Sprint +\W +(.*)/i, data[:name])
        |> List.last
    
      {:ok, Map.put(data, :sprint_name, sprint_name)}
    else
      {:error, data}
    end
  end

  def get_labels_for_board(board_id, secret) do
    {:ok, data} = get("boards/#{board_id}/labels", secret)

    if (is_list data), do: {:ok, data}, else: {:error, data}
  end

  def calculate_points_for_board(board, secret \\ nil) do
    if (board.labels) do
      calculate_points_from_labels(board.labels)
    else
      board.id
        |> get_labels_for_board(secret)
        |> calculate_points_from_labels
    end
  end

  def calculate_points_from_labels(labels) do
    Enum.reduce(labels, 0, fn(label, acc) ->
      %{name: name, uses: uses} = label

      if (uses > 0 && name != "") do
        acc = acc + get_label_points(name) * uses
        acc
      else
        acc
      end
    end)
  end

  defp create_url(url, secret) do
    params = "token=#{secret}&key=#{token}"
    base = if has_query_params?(url), do: url <> params, else: "#{url}?#{params}"

    trello_base <> base
  end

  defp get(url, secret), do: HttpRequest.get create_url(url, secret)
  defp has_query_params?(url), do: Regex.match?(~r/\?/, url)
  defp token, do: System.get_env("TRELLO_KEY")
  defp trello_base, do: "https://trello.com/1/"
  defp get_label_points(label_name), do: Map.get(label_map, label_name) || 0
  defp label_map do
    for {key, value} <- Map.to_list(@raw_label_map), into: %{} do
      env_key = System.get_env(Atom.to_string(key) <> "_LABEL_NAME")
        |> String.strip

      {env_key, value}
    end
  end
end
