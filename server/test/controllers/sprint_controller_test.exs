defmodule TrelloBurndown.SprintControllerTest do
  use TrelloBurndown.ConnCase

  alias TrelloBurndown.Sprint
  @valid_attrs %{board_id: "some content", holidays: [], point_total: 42, sprint_name: "some content"}
  @invalid_attrs %{}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, sprint_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    sprint = Repo.insert! %Sprint{}
    conn = get conn, sprint_path(conn, :show, sprint)
    assert json_response(conn, 200)["data"] == %{"id" => sprint.id,
      "board_id" => sprint.board_id,
      "sprint_name" => sprint.sprint_name,
      "point_total" => sprint.point_total,
      "team_id" => sprint.team_id,
      "holidays" => sprint.holidays}
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, sprint_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, sprint_path(conn, :create), sprint: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Sprint, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, sprint_path(conn, :create), sprint: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    sprint = Repo.insert! %Sprint{}
    conn = put conn, sprint_path(conn, :update, sprint), sprint: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Sprint, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    sprint = Repo.insert! %Sprint{}
    conn = put conn, sprint_path(conn, :update, sprint), sprint: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    sprint = Repo.insert! %Sprint{}
    conn = delete conn, sprint_path(conn, :delete, sprint)
    assert response(conn, 204)
    refute Repo.get(Sprint, sprint.id)
  end
end
