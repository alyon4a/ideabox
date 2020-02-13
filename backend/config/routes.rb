Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  # Users
  get '/users', to: 'users#index'
  get '/users/login', to: 'users#login'
  get '/users/:id', to: 'users#show'
  # Ideas
  get '/ideas', to: 'ideas#index'
  post '/ideas', to: 'ideas#create'
  get '/ideas/:id', to: 'ideas#show'
  patch '/ideas/:id', to: 'ideas#update'
  delete '/ideas/:id', to: 'ideas#destroy'
  # Comments
  get '/comments/user/:id', to: 'comments#userComments'
  get '/comments/idea/:id', to: 'comments#ideaComments'
  # Up Vote
  post '/up_votes', to: 'up_votes#create'
  delete '/up_votes/:id', to: 'up_votes#destroy'
   # Implementor
   post '/implementors', to: 'implementors#create'
   delete '/implementors/:id', to: 'implementors#destroy'
end
