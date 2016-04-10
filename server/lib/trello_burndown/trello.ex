defmodule TrelloBurndown.Trello do
  alias TrelloBurndown.HttpRequest

  @unstarted_lists [~r/\[(agency|school|agencies).*\]/i]
  @current_development_lists [~r/in progress/i]
  @blocked_development_lists [~r/blocked/i]
  @development_complete_lists [~r/(signoff|stage)/i]
  @fully_complete_lists [~r/(complete|done).*!?/i]
  @testing_lists [~r/test(ing)?/i]
  @testing_complete_lists [~r/testing *?(done|complete)/i]
  @all_lists List.flatten([
    @fully_complete_lists,
    @blocked_development_lists,
    @unstarted_lists,
    @current_development_lists,
    @testing_complete_lists,
    @testing_lists,
    @development_complete_lists
  ])

  @raw_label_map %{
    SMALL: 1,
    MEDIUM: 2,
    LARGE: 4,
    EXTRA_LARGE: 8
  }

  def get_board(board_id, secret) do
    with {:ok, board} <- Trello.get_full_board board_id, secret do
      sprint_name = Regex.run(~r/Sprint +\W +(.*)/i, board[:name])
        |> List.last

      board = Map.put(board, :sprint_name, sprint_name)
       |> Map.put(:points, calculate_points_from_labels(board.labels))
       |> sort_cards_for_board

      {:ok, board}
    end
  end

  def sort_lists_for_board(board) do
    lists = board.lists
      |> get_used_lists(@all_lists)
      |> calculate_points_per_list

    in_progress_lists = List.flatten [@current_development_lists, @blocked_development_lists]
    dev_complete_lists = List.flatten [@development_complete_lists, @testing_complete_lists, @testing_lists]

    lists = Enum.group_by lists, fn(list) ->
      cond do
        is_in_list? list, @development_complete_lists -> :dev_complete
        is_in_list? list, @fully_complete_lists -> :complete
        is_in_list? list, in_progress_lists -> :in_progress
        true -> :uncompleted
      end
    end

    Map.put(board, :lists, lists)
  end

  def calculate_points_per_list(lists) do
    Enum.map(lists, fn(list) ->
      if (Enum.any? list.cards) do
        Map.put list, :points, calculate_list_points(list)
      else
        list
      end
    end)
  end

  def calculate_list_points(list) do
    Enum.reduce list.cards, 0, fn(card, acc) ->
      # points = get_label_points(card.labels)
      points = Enum.reduce card.labels, 0, fn(label, acc) ->
        acc = acc + get_label_points(label.name)
      end

      acc = acc + points
    end
  end

  def sort_cards_for_board(board), do: sort_lists_for_board(board)

  def sort_cards_for_board(board_id, secret) do
    if (is_map(board_id)) do
      sort_cards_for_board board_id
    else
      with {:ok, board} <- get_board(board_id, secret) do
        {:ok, sort_cards_for_board(board)}
      end
    end
  end

  defp get_label_points(label_name), do: Map.get(label_map, label_name) || 0

  defp label_map do
    for {key, value} <- Map.to_list(@raw_label_map), into: %{} do
      env_key = System.get_env(Atom.to_string(key) <> "_LABEL_NAME")
        |> String.strip

      {env_key, value}
    end
  end

  defp calculate_points_from_labels(labels) do
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

  defp is_in_list?(list, list_regexes) do
    Enum.any? list_regexes, fn(list_item) ->
      Regex.match? list_item, list.name
    end
  end

  defp is_used_list?(list, list_regexes) do
    Enum.any? list_regexes, fn(regex) ->
      Regex.match?(regex, list.name)
    end
  end

  defp get_used_lists(lists, list_regexes) do
    Enum.filter lists, fn(list) ->
      is_used_list?(list, list_regexes)
    end
  end
end
