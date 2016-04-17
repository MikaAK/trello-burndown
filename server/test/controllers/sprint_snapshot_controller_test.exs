defmodule TrelloBurndown.SprintSnapshotControllerTest do
  use TrelloBurndown.ConnCase

  alias TrelloBurndown.SprintSnapshot
  @valid_attrs %{
    points_complete: 42,
    points_dev_complete: 42,
    points_left: 42,
    sprint_id: 42,
    sprint_team_snapshot_id: 42
  }
  @invalid_attrs %{}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, sprint_snapshot_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    sprint_snapshot = Repo.insert! %SprintSnapshot{}
    conn = get conn, sprint_snapshot_path(conn, :show, sprint_snapshot)

    assert json_response(conn, 200)["data"] == %{
      "id" => sprint_snapshot.id,
      "points_left" => sprint_snapshot.points_left,
      "points_complete" => sprint_snapshot.points_complete,
      "points_dev_complete" => sprint_snapshot.points_dev_complete,
      "sprint_id" => sprint_snapshot.sprint_id,
      "sprint_team_member_snapshots" => []
    }
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, sprint_snapshot_path(conn, :show, -1)
    end
  end

  # test "creates and renders resource when data is valid", %{conn: conn} do
  #   conn = post conn, sprint_snapshot_path(conn, :create), sprint_snapshot: @valid_attrs
  #   assert json_response(conn, 201)["data"]["id"]
  #   assert Repo.get_by(SprintSnapshot, @valid_attrs)
  # end

  # test "does not create resource and renders errors when data is invalid", %{conn: conn} do
  #   conn = post conn, sprint_snapshot_path(conn, :create), sprint_snapshot: @invalid_attrs
  #   assert json_response(conn, 422)["errors"] != %{}
  # end

  # test "updates and renders chosen resource when data is valid", %{conn: conn} do
  #   sprint_snapshot = Repo.insert! %SprintSnapshot{}
  #   conn = put conn, sprint_snapshot_path(conn, :update, sprint_snapshot), sprint_snapshot: @valid_attrs
  #   assert json_response(conn, 200)["data"]["id"]
  #   assert Repo.get_by(SprintSnapshot, @valid_attrs)
  # end

  # test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
  #   sprint_snapshot = Repo.insert! %SprintSnapshot{}
  #   conn = put conn, sprint_snapshot_path(conn, :update, sprint_snapshot), sprint_snapshot: @invalid_attrs
  #   assert json_response(conn, 422)["errors"] != %{}
  # end

  # test "deletes chosen resource", %{conn: conn} do
  #   sprint_snapshot = Repo.insert! %SprintSnapshot{}
  #   conn = delete conn, sprint_snapshot_path(conn, :delete, sprint_snapshot)
  #   assert response(conn, 204)
  #   refute Repo.get(SprintSnapshot, sprint_snapshot.id)
  # end
end
