class IdeaDetailSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :image
  belongs_to :user
  has_many :up_votes
  has_many :implementors
  has_many :tags

  def up_votes 
    self.object.up_votes ? self.object.up_votes.length : 0
  end

  def implementors
    self.object.implementors.map{|implementor| implementor.user}
  end
end
