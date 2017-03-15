# Next Int

Live version: [https://thinkific.akiosakae.com/](https://thinkific.akiosakae.com/)

## How to run locally
```javascript
git clone git@github.com:akiokio/NextInt.git
cd NextInt
yarn install
mv sample.env .env
yarn start
```
The project will be availabe at: http://localhost:3000

## Considerations
- Note That the sample file only contains a sandbox mongo url and for security reasons the social auth keys are dummies
- The social login works live
- Due to time contraints only google login is enabled

## LIVE API ENDPOINTS
POST: https://thinkific.akiosakae.com/v1/next (Protected)
GET: https://thinkific.akiosakae.com/v1/current (Protected)
PUT: https://thinkific.akiosakae.com/v1/current (Protected)

## Quick curl commands using a dummy account and token
**Get the next integer in the sequence:**
```HTTP
curl https://thinkific.akiosakae.com/v1/next -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YzhjYTMyNTAyMGYwN2MzOTMxOTNiMiIsImVtYWlsIjoiZHVtbXlAZHVtbXkuY29tIiwiaWF0IjoxNDg5NTUzOTcwLCJleHAiOjE0OTIxNDU5NzB9.LStWa0jpQ1hcwfZ6YgyrP8nJ-NuD4NmNCbPBYl8du60"
```
**Get the current integer**
```HTTP
curl https://thinkific.akiosakae.com/v1/current -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YzhjYTMyNTAyMGYwN2MzOTMxOTNiMiIsImVtYWlsIjoiZHVtbXlAZHVtbXkuY29tIiwiaWF0IjoxNDg5NTUzOTcwLCJleHAiOjE0OTIxNDU5NzB9.LStWa0jpQ1hcwfZ6YgyrP8nJ-NuD4NmNCbPBYl8du60"
```
**Reset the current integer**
```HTTP
curl -X "PUT" https://thinkific.akiosakae.com/v1/current -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YzhjYTMyNTAyMGYwN2MzOTMxOTNiMiIsImVtYWlsIjoiZHVtbXlAZHVtbXkuY29tIiwiaWF0IjoxNDg5NTUzOTcwLCJleHAiOjE0OTIxNDU5NzB9.LStWa0jpQ1hcwfZ6YgyrP8nJ-NuD4NmNCbPBYl8du60" --data "current=1000"
```
**Create a new user**
```HTTP
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "dummy@gmail.com",
  "password": "123123",
  "password2": "123123"
}' https://thinkific.akiosakae.com/v1/signup
```
*Response example:*
- Success:
```
{
  "status":"success",
  "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YzhjY2Q0NTAyMGYwN2MzOTMxOTNiYyIsImVtYWlsIjoiZHVtbXlAZ21haWwuY29tIiwiaWF0IjoxNDg5NTU0NjQ0LCJleHAiOjE0OTIxNDY2NDR9.RJrg1dOv-TwGLARil31CgDBC62A9tUYB8hO3FM1-3jA"
}
```
- Error:
```
{
  "status":"error",
  "errors":["Email already exists"]
}
```
**Login Existing user:**
```HTTP
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "dummy@gmail.com",
  "password": "123123"
}' "https://thinkific.akiosakae.com/v1/login"
```
*Response example:*
- Success:
```
{
  "status":"success",
  "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YzhjY2Q0NTAyMGYwN2MzOTMxOTNiYyIsImVtYWlsIjoiZHVtbXlAZ21haWwuY29tIiwiaWF0IjoxNDg5NTU0NjQ0LCJleHAiOjE0OTIxNDY2NDR9.RJrg1dOv-TwGLARil31CgDBC62A9tUYB8hO3FM1-3jA"
}
```
- Error:
```
Unauthorized
```
