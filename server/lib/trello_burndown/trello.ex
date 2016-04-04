defmodule TrelloBurndown.Trello do
  def get(url, secret) do

  end

  def get_board(board_id, secret) do

  end

  def get_labels_for_board(board_id, secret) do
    create_url("boards/#{board_id}/labels", secret)
  end

  defp create_url(url, secret) do
    params = "token=#{secret}&key=#{token}"
    base = if has_query_params?(url), do: url <> params, else: "#{url}?#{params}"

    trello_base <> base
  end

  defp has_query_params?(url), do: Regex.match?(~r/\?/, url)
  defp token, do: System.get_env("TRELLO_KEY")
  defp trello_base, do: "https://trello.com/1/"
end
