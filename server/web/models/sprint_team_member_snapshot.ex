defmodule TrelloBurndown.SprintTeamMemberSnapshot do
  use TrelloBurndown.Web, :model

  schema "sprint_team_member_snapshots" do
    belongs_to :sprint_snapshot, TrelloBurndown.SprintSnapshot
    belongs_to :team_member, TrelloBurndown.TeamMember
    field :points_complete, :integer
    field :points_dev_complete, :integer

    timestamps
  end

  @required_fields ~w(points_complete points_dev_complete)a
  @optional_fields ~w()a

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ %{}) do
    model
      |> cast(params, Enum.concat(@required_fields, @optional_fields))
      |> validate_required(@required_fields)
      |> cast_assoc(:team_member, required: true)
  end
end
