class IdeaSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :image
  has_many :up_votes
  def up_votes 
    self.object.up_votes ? self.object.up_votes.length : 0
  end
end
