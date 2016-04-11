defmodule TrelloBurndown.ApiController do
  use TrelloBurndown.Web, :controller
  alias TrelloBurndown.ErrorView

  def not_found(conn, _) do
    put_status(conn, :not_found)
      |> render(ErrorView, "404.json")
  end
end
