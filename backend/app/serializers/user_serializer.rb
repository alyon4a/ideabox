class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :name, :image
  has_many :up_votes
end
