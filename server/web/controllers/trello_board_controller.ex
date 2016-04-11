defmodule TrelloBurndown.TrelloBoardController do
  use TrelloBurndown.Web, :controller
  import IEx

  alias TrelloBurndown.Trello

  plug :has_authorization

  def show(conn, %{"id" => id}) do
    case Trello.get_board(id, secret(conn)) do
      {:ok, board} -> 
        put_status(conn, :ok)
          |> json(board)
          
      {:error, error} ->
        put_status(conn, :internal_server_error)
          |> json(parse_error(error))
    end
  end

  def labels_index(conn, %{"trello_board_id" => id}) do
    case Trello.get_labels_for_board(id, secret(conn)) do
      {:ok, labels} ->
        put_status(conn, :ok)
          |> json(labels)

      {:error, error} ->
        put_status(conn, :internal_server_error)
          |> json(parse_error(error))
    end
  end
  
  def has_authorization(conn, _opts) do
    secret = get_req_header conn, "authorization"

    if (!secret) do
      put_status(conn, :unauthorized)
        |> json(parse_error("Must provide authorization header"))
    else
      conn
    end
  end

  defp parse_error(error), do: %{error: error}
  defp secret(conn), do: get_req_header conn, "authorization"
end

