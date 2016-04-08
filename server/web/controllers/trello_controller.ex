defmodule TrelloBurndown.TrelloController do
  import IEx
  use TrelloBurndown.Web, :controller
  alias TrelloBurndown.Trello

  def show(conn, %{"id" => id}) do
    if (Map.has_key? conn.query_params, "secret") do
      %{"secret" => secret} = conn.query_params

      case Trello.get_full_board(id, secret) do
        {:ok, board} -> 
          put_status(conn, :ok)
            |> json(board)
            
        {:error, error} ->
          put_status(conn, :internal_server_error)
            |> json(parse_error(error))
      end
    else
      put_status(conn, :unauthorized)
        |> json(parse_error("Must provide secret"))
    end
  end

  defp parse_error(error) when is_bitstring(error) do
    %{error: error}
  end
end

