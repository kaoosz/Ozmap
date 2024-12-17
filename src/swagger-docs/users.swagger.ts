/**
 * @swagger
 * components:
 *   schemas:
 *     UserCreate:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The user's full name.
 *           example: "gui alves"
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *           example: "guitesterr@gmail.com"
 *         password:
 *           type: string
 *           description: The user's password.
 *           example: "gui"
 *         address:
 *           type: string
 *           description: Optional. The user's address. Provide either `address` or `coordinates`, not both.
 *           example: "Avenida Agenor Alves dos Santos"
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           description: Optional. The user's geographical coordinates as [longitude, latitude]. Provide either `address` or `coordinates`, not both.
 *           example: [-45.7728598, -23.1384991]
 *       oneOf:
 *         - required: ["address"]
 *         - required: ["coordinates"]
 *   examples:
 *     CreateWithAddress:
 *       summary: User creation with an address
 *       value:
 *         name: "gui alves"
 *         email: "guitesterr@gmail.com"
 *         password: "gui"
 *         address: "Avenida Agenor Alves dos Santos"
 *     CreateWithCoordinates:
 *       summary: User creation with coordinates
 *       value:
 *         name: "gui alves"
 *         email: "guitesterr@gmail.com"
 *         password: "gui"
 *         coordinates: [-45.7728598, -23.1384991]
 *   responses:
 *     ValidationError:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               error:
 *                 - "Provide either address or coordinates, not both."
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *           examples:
 *             withAddress:
 *               $ref: '#/components/examples/CreateWithAddress'
 *             withCoordinates:
 *               $ref: '#/components/examples/CreateWithCoordinates'
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCreate'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []  # Attach the BearerAuth security scheme here
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Updated email address.
 *               address:
 *                 type: string
 *                 description: Updated address of the user.
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Updated coordinates (longitude, latitude).
 *     responses:
 *       200:
 *         description: User successfully updated.
 *       401:
 *         description: Unauthorized (missing or invalid JWT).
 */
