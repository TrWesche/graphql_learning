// Scalar Types: String, Boolean, Int, Float, ID
// Exclamation Point means it cannot be null
const users = [
    {id: 'abc12301', name: 'Trent', email: 'trent@example.com', age: 32},
    {id: 'abc12302', name: 'Camille', email: 'camille@example.com'},
    {id: 'abc12303', name: 'Zoltar', email: 'zoltar@example.com', age: 1000}
]

const posts = [
    {id: 'postXYZ001', title: 'My First Post', body: 'Body of the first post', published: true, author_id: "abc12301"},
    {id: 'postXYZ002', title: 'My Second Post', body: 'Body of the second post', published: true, author_id: "abc12302"},
    {id: 'postXYZ003', title: 'My Third Post', body: 'Body of the third post', published: false, author_id: "abc12301"},
    {id: 'postXYZ004', title: 'My Fourth Upload', body: 'This is the text for the fourth upload', published: true, author_id: "abc12303"}
]

const comments = [
    {id: 'commentABC001', text: 'This is the first comment on post 1', author_id: "abc12302", post_id: "postXYZ001"},
    {id: 'commentABC002', text: 'This is the second comment on post 1', author_id: "abc12303", post_id: "postXYZ001"},
    {id: 'commentABC003', text: 'This is the first comment on post 3', author_id: "abc12302", post_id: "postXYZ003"},
    {id: 'commentABC004', text: 'This is the first comment on post 4', author_id: "abc12302", post_id: "postXYZ004"}
]

const db = {
    users,
    posts,
    comments
}

export default db;