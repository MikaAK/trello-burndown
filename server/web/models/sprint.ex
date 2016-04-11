defmodule TrelloBurndown.Sprint do
  use TrelloBurndown.Web, :model
  alias TrelloBurndown.Trello
  alias TrelloBurndown.Repo

  schema "sprints" do
    field :board_id, :string
    field :sprint_name, :string
    field :auth_token, :string
    field :points, :integer
    field :start_date, Ecto.Date
    field :end_date, Ecto.Date
    belongs_to :team, TrelloBurndown.Team

    timestamps
  end

  @required_fields ~w(board_id sprint_name team_id auth_token)
  @optional_fields ~w(points start_date end_date)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end


  def get_active do
    query = from s in TrelloBurndown.Sprint,
            where: s.end_date > ^Ecto.Date.utc

    Repo.all query
  end

  def get_points(sprint) do
    labels = Trello.get_labels_for_board sprint.board_id

    for {used, name} <- labels, into: 0 do
      if used do
        value = get_label_value(name)

        if value, do: value * used, else: 0
      else
        0
      end
    end
  end

  defp get_label_value(name) do
    label_map = %{"Small": 1, "Medium": 2, "Large": 4, "Extra Large": 5}

    label_map[name]
  end
end
