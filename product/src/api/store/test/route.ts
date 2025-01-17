// import type {
//     MedusaRequest,
//     MedusaResponse,
// } from "@medusajs/framework/http"
// import Post_Schema from "./shema";

// export const GET = async (
//     req: MedusaRequest,
//     res: MedusaResponse
// ) => {
//     res.json({
//       message: "[GET] Hello world!",
//     })
// }

// export const POST = async (
//     req: MedusaRequest,
//     res: MedusaResponse
// ) => {
//     console.log(req.body);
//     const result = Post_Schema.safeParse(req.body);
//     if (result.success) {
//         // If parsing is successful, you can use the validated data
//         const post = result.data;

//         res.json({
//             status: 200,
//             message: post
//         });
//     } else {
//         // If parsing fails, send an error response
//         res.status(400).json({
//             status: 400,
//             message: 'Invalid data',
//             errors: result.error.errors
//         });
//     }
// }

// export const PUT = async (
//     req: MedusaRequest,
//     res: MedusaResponse
// ) => {
//     console.log(req.body);
//     const result = Post_Schema.safeParse(req.body);
//     if (result.success) {
//         // Assuming you would update a post here, for now just return the updated data
//         const updatedPost = result.data;

//         res.json({
//             status: 200,
//             message: 'Post updated successfully',
//             updatedPost
//         });
//     } else {
//         res.status(400).json({
//             status: 400,
//             message: 'Invalid data',
//             errors: result.error.errors
//         });
//     }
// };

// // DELETE method
// export const DELETE = async (
//     req: MedusaRequest,
//     res: MedusaResponse
// ) => {
//     const { id } = req.params; // Assuming you're deleting by post ID in URL params
//     if (!id) {
//         return res.status(400).json({
//             status: 400,
//             message: 'Post ID is required'
//         });
//     }

//     // Here, you'd typically delete the post from your database or any data store
//     // For now, just simulate successful deletion
//     res.json({
//         status: 200,
//         message: `Post with ID ${id} deleted successfully`
//     });
// };