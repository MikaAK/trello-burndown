defmodule TrelloBurndown.TeamMemberTest do
  use TrelloBurndown.ModelCase

  alias TrelloBurndown.TeamMember

  @valid_attrs %{trello_id: "some content", velocity: 120.5, admin: false}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = TeamMember.changeset(%TeamMember{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = TeamMember.changeset(%TeamMember{}, @invalid_attrs)
    refute changeset.valid?
  end
end
