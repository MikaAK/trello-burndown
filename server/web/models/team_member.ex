defmodule TrelloBurndown.TeamMember do
  use TrelloBurndown.Web, :model

  schema "team_members" do
    field :velocity, :float
    field :trello_id, :string
    field :admin, :boolean
    belongs_to :team, TrelloBurndown.Team

    timestamps
  end

  @required_fields ~w(velocity trello_id)a
  @optional_fields ~w(admin)a

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ %{}) do
    model
      |> cast(params, Enum.concat(@required_fields, @optional_fields))
      |> validate_required(@required_fields)
      |> assoc_constraint(:team)
  end
end
