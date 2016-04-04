defmodule TrelloBurndown.SprintTeamMemberSnapshotTest do
  use TrelloBurndown.ModelCase

  alias TrelloBurndown.SprintTeamMemberSnapshot

  @valid_attrs %{points_complete: 42, points_dev_complete: 42, sprint_snapshot_id: 42, team_member_id: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = SprintTeamMemberSnapshot.changeset(%SprintTeamMemberSnapshot{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = SprintTeamMemberSnapshot.changeset(%SprintTeamMemberSnapshot{}, @invalid_attrs)
    refute changeset.valid?
  end
end
