defmodule TrelloBurndown.PageController do
  use TrelloBurndown.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
