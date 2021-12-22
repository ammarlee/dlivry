var { buildSchema } = require("graphql");
module.exports = buildSchema(`
type TestData {
  text: String!
  views:Int!
  name:String!
  age:Int!
  city:String!
}
type allPosts{
    posts:[Post!]!
}
type Post {
    _id:ID!
    discription: String!


}
type Product {
    _id:ID!
    discription: String!
    userId:User
    name:String!
    rating:ID!
    price:Int!
    quantity:Int!

}

type User{
    _id:ID!
    email: String!
    name:String!
    phone:String!
    
}
input userInputData{
    email: String!
    password:String!
    name:String!
    bio:String!
    phone:String!
    
}
input userLoginData{
    email: String!
    password:String!
}

type rootMutation{
    creatUser(userinput:userInputData):User!
    loginUser(userinput:userLoginData):User!
}
type RootQuery{
    hello:TestData!
    fetchProducts:allPosts!
    product(id:ID!):Product
}
schema{
    query:RootQuery
    mutation:rootMutation
    
}
`);
