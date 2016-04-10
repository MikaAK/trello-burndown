defmodule TrelloBurndown.TrelloBoardController do
  use TrelloBurndown.Web, :controller

  alias TrelloBurndown.Trello

  def show(conn, %{"id" => id}) do
    secret = get_req_header conn, "authorization"

    if (secret) do
      case Trello.get_board(id, secret) do
        {:ok, board} -> 
          put_status(conn, :ok)
            |> json(board)
            
        {:error, error} ->
          put_status(conn, :internal_server_error)
            |> json(parse_error(error))
      end
    else
      put_status(conn, :unauthorized)
        |> json(parse_error("Must provide authorization header"))
    end
  end

  defp parse_error(error), do: %{error: error}
end

