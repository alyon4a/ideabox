Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  # Users
  get '/users', to: 'users#index'
  get '/users/:id', to: 'users#show'
  # Ideas
  get '/ideas', to: 'ideas#index'
  post '/ideas', to: 'ideas#create'
  # Comments
  get '/comments/user/:id', to: 'comments#userComments'
  get '/comments/idea/:id', to: 'comments#ideaComments'
end
