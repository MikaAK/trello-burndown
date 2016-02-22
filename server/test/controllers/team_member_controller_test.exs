defmodule TrelloBurndown.TeamMemberControllerTest do
  use TrelloBurndown.ConnCase

  alias TrelloBurndown.TeamMember
  @valid_attrs %{name: "some content", trello_id: "some content", velocity: "120.5"}
  @invalid_attrs %{}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, team_member_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    team_member = Repo.insert! %TeamMember{}
    conn = get conn, team_member_path(conn, :show, team_member)
    assert json_response(conn, 200)["data"] == %{"id" => team_member.id,
      "name" => team_member.name,
      "velocity" => team_member.velocity,
      "trello_id" => team_member.trello_id,
      "team_id" => team_member.team_id}
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, team_member_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, team_member_path(conn, :create), team_member: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(TeamMember, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, team_member_path(conn, :create), team_member: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    team_member = Repo.insert! %TeamMember{}
    conn = put conn, team_member_path(conn, :update, team_member), team_member: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(TeamMember, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    team_member = Repo.insert! %TeamMember{}
    conn = put conn, team_member_path(conn, :update, team_member), team_member: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    team_member = Repo.insert! %TeamMember{}
    conn = delete conn, team_member_path(conn, :delete, team_member)
    assert response(conn, 204)
    refute Repo.get(TeamMember, team_member.id)
  end
end
