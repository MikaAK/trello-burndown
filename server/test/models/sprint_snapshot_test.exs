defmodule TrelloBurndown.SprintSnapshotTest do
  use TrelloBurndown.ModelCase

  alias TrelloBurndown.SprintSnapshot

  @valid_attrs %{
    in_progress_points: 32,
    points_complete: 42,
    points_dev_complete: 42,
    points_left: 42,
    sprint_id: 42,
    sprint_team_snapshot_id: 42
  }
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = SprintSnapshot.changeset(%SprintSnapshot{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = SprintSnapshot.changeset(%SprintSnapshot{}, @invalid_attrs)
    refute changeset.valid?
  end
end
