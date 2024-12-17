/**
 * @swagger
 * components:
 *   schemas:
 *     RegionCreate:
 *       type: object
 *       required:
 *         - name
 *         - geometry
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the region.
 *           example: "Test Region"
 *         geometry:
 *           type: object
 *           required:
 *             - type
 *             - coordinates
 *           properties:
 *             type:
 *               type: string
 *               enum: [Polygon]
 *               description: Type of the geometry.
 *               example: "Polygon"
 *             coordinates:
 *               type: array
 *               description: Coordinates for the region's geometry.
 *               items:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: number
 *               example: [
 *                 [
 *                   [0, 0],
 *                   [1, 1],
 *                   [1, 0],
 *                   [0, 0]
 *                 ]
 *               ]
 *       example:
 *         name: "Test Region"
 *         geometry:
 *           type: "Polygon"
 *           coordinates: [
 *             [
 *               [0, 0],
 *               [1, 1],
 *               [1, 0],
 *               [0, 0]
 *             ]
 *           ]
 *
 * /regions:
 *   post:
 *     summary: Create a new region
 *     tags: [Regions]
 *     security:
 *       - BearerAuth: []  # Attach the BearerAuth security scheme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegionCreate'
 *     responses:
 *       201:
 *         description: Region successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "675f1b20113cb12e14bed201"
 *                 name:
 *                   type: string
 *                   example: "Test Region"
 *                 geometry:
 *                   $ref: '#/components/schemas/RegionCreate/properties/geometry'
 *                 user:
 *                   type: string
 *                   example: "675f1b20113cb12e14bed202"
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized. Missing or invalid JWT.
 */

/**
 * @swagger
 * /regions/contains:
 *   get:
 *     summary: Retrieve regions containing a specific point
 *     description: Fetch all regions that contain the given point specified by longitude and latitude.
 *     tags: [Regions]
 *     parameters:
 *       - in: query
 *         name: lng
 *         schema:
 *           type: string
 *           example: "-45.7728598"
 *         required: true
 *         description: Longitude of the point.
 *       - in: query
 *         name: lat
 *         schema:
 *           type: string
 *           example: "-23.1384991"
 *         required: true
 *         description: Latitude of the point.
 *     responses:
 *       200:
 *         description: Regions successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier for the region.
 *                     example: "675f1b20113cb12e14bed201"
 *                   name:
 *                     type: string
 *                     description: Name of the region.
 *                     example: "Region 1"
 *                   geometry:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "Polygon"
 *                       coordinates:
 *                         type: array
 *                         description: Coordinates of the region's geometry.
 *                         example: [
 *                           [
 *                             [-45.7728598, -23.1384991],
 *                             [-45.7730633, -23.1379888],
 *                             [-45.7728598, -23.1384991]
 *                           ]
 *                         ]
 *                   user:
 *                     type: string
 *                     description: User ID who created the region.
 *                     example: "675f1b20113cb12e14bed202"
 *       400:
 *         description: Validation error in query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: array
 *                   items:
 *                     type: string
 *               example:
 *                 error:
 *                   - "lng must be a valid number"
 *                   - "lat must be a valid number"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /regions/near:
 *   get:
 *     summary: Retrieve regions near a specified point
 *     description: Fetch all regions within a specified distance (in kilometers) from a given point (longitude and latitude).
 *     tags: [Regions]
 *     parameters:
 *       - in: query
 *         name: lng
 *         schema:
 *           type: string
 *           example: "-45.7728598"
 *         required: true
 *         description: Longitude of the point.
 *       - in: query
 *         name: lat
 *         schema:
 *           type: string
 *           example: "-23.1384991"
 *         required: true
 *         description: Latitude of the point.
 *       - in: query
 *         name: km
 *         schema:
 *           type: string
 *           example: "10"
 *         required: true
 *         description: Radius distance in kilometers to search for regions.
 *       - in: query
 *         name: excludeUserId
 *         schema:
 *           type: string
 *           example: "675f1b20113cb12e14bed202"
 *         required: false
 *         description: User ID to exclude regions created by this user.
 *     responses:
 *       200:
 *         description: Regions successfully retrieved within the specified distance.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier for the region.
 *                     example: "675f1b20113cb12e14bed201"
 *                   name:
 *                     type: string
 *                     description: Name of the region.
 *                     example: "Region 1"
 *                   geometry:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "Polygon"
 *                       coordinates:
 *                         type: array
 *                         description: Coordinates of the region's geometry.
 *                         example: [
 *                           [
 *                             [-45.7728598, -23.1384991],
 *                             [-45.7730633, -23.1379888],
 *                             [-45.7728598, -23.1384991]
 *                           ]
 *                         ]
 *                   user:
 *                     type: string
 *                     description: User ID who created the region.
 *                     example: "675f1b20113cb12e14bed202"
 *       400:
 *         description: Validation error in query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: array
 *                   items:
 *                     type: string
 *               example:
 *                 error:
 *                   - "lng must be a valid number"
 *                   - "lat must be a valid number"
 *                   - "km must be valid integer number not negative numbers"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
