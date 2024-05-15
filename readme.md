#register user api-
end point -post  http://localhost:4000/api/v1/register

parameters -
name:admin
email:pari355@gmail.com
password:admin@123
bio:hi this is paruitosd soft developer 
isPrivate:1

send above parameters for register user api
set isPrivate 1 to make profile private and 0 to make public

#login user
post  http://localhost:4000/api/v1/login

parameters -
email -
password -

#log out user 
post  http://localhost:4000/api/v1/logout

# get all public users details
get http://localhost:4000/api/v1/users

#update profile 
put - http://localhost:4000/api/v1/me/update

send parameters to update data
name:admin
email:pari355@gmail.com
password:admin@123
bio:hi this is paruitosd soft developer 
isPrivate:1

#my profile details
post - http://localhost:4000/api/v1/me

send user_id in parameters to get profile details

#admin login 
post - http://localhost:4000/api/v1/login

send default admin parameters 
{
email:admin@gmail.com
password:admin@123
}

#get all users for admin 
login with admin and call
get - http://localhost:4000/api/v1/admin/users
