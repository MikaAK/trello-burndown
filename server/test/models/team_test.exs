defmodule TrelloBurndown.TeamTest do
  use TrelloBurndown.ModelCase

  alias TrelloBurndown.Team

  @valid_attrs %{name: "some content", team_members: [%{
    trello_id: "My Name",
    velocity: 32.0,
  }]}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Team.changeset(%Team{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Team.changeset(%Team{}, @invalid_attrs)
    refute changeset.valid?
  end
end
