defmodule TrelloBurndown.SprintTeamMemberSnapshotControllerTest do
  use TrelloBurndown.ConnCase

  alias TrelloBurndown.SprintTeamMemberSnapshot
  @valid_attrs %{points_complete: 42, points_dev_complete: 42, sprint_snapshot_id: 42, team_member_id: 42}
  @invalid_attrs %{}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, sprint_team_member_snapshot_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    sprint_team_member_snapshot = Repo.insert! %SprintTeamMemberSnapshot{}
    conn = get conn, sprint_team_member_snapshot_path(conn, :show, sprint_team_member_snapshot)
    assert json_response(conn, 200)["data"] == %{"id" => sprint_team_member_snapshot.id,
      "sprint_snapshot_id" => sprint_team_member_snapshot.sprint_snapshot_id,
      "team_member_id" => sprint_team_member_snapshot.team_member_id,
      "points_complete" => sprint_team_member_snapshot.points_complete,
      "points_dev_complete" => sprint_team_member_snapshot.points_dev_complete}
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, sprint_team_member_snapshot_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, sprint_team_member_snapshot_path(conn, :create), sprint_team_member_snapshot: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(SprintTeamMemberSnapshot, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, sprint_team_member_snapshot_path(conn, :create), sprint_team_member_snapshot: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    sprint_team_member_snapshot = Repo.insert! %SprintTeamMemberSnapshot{}
    conn = put conn, sprint_team_member_snapshot_path(conn, :update, sprint_team_member_snapshot), sprint_team_member_snapshot: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(SprintTeamMemberSnapshot, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    sprint_team_member_snapshot = Repo.insert! %SprintTeamMemberSnapshot{}
    conn = put conn, sprint_team_member_snapshot_path(conn, :update, sprint_team_member_snapshot), sprint_team_member_snapshot: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    sprint_team_member_snapshot = Repo.insert! %SprintTeamMemberSnapshot{}
    conn = delete conn, sprint_team_member_snapshot_path(conn, :delete, sprint_team_member_snapshot)
    assert response(conn, 204)
    refute Repo.get(SprintTeamMemberSnapshot, sprint_team_member_snapshot.id)
  end
end
