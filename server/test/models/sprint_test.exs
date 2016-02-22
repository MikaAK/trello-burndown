defmodule TrelloBurndown.SprintTest do
  use TrelloBurndown.ModelCase

  alias TrelloBurndown.Sprint

  @valid_attrs %{board_id: "some content", holidays: [], point_total: 42, sprint_name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Sprint.changeset(%Sprint{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Sprint.changeset(%Sprint{}, @invalid_attrs)
    refute changeset.valid?
  end
end
