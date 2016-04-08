defmodule TrelloBurndown.PageControllerTest do
  use TrelloBurndown.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "Trello Burndowns"
  end
end
