class UsersController < ApplicationController
    def create
        user = User.create(user_params)
        render json: user, status: 201
    end

    def index
        users = User.all
        render json: users, status: 201
    end

    private
    def user_params
        params.require(:user).permit(:name, :email, :image)
    end
end