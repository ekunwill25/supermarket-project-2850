import java.sql.Connection
import java.sql.DriverManager
import java.sql.SQLException
import java.sql.Statement

fun main() {
    val url = "jdbc:sqlite:supermarket.db"

    var conn: Connection? = null
    var statement: Statement? = null

    try {
        // Connect to the database
        conn = DriverManager.getConnection(url)
        statement = conn.createStatement()

        // Create Category Table
        statement.execute(
            """
            CREATE TABLE IF NOT EXISTS Category(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            )
            """.trimIndent()
        )

        // Create Product Table
        statement.execute(
            """
            CREATE TABLE IF NOT EXISTS Product(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                category_id INTEGER,
                FOREIGN KEY(category_id) REFERENCES Category(id)
            )
            """.trimIndent()
        )

        // Insert Categories
        val categories = listOf("Breakfast", "Meat", "Snacks", "Seafood", "Organic")
        for (cat in categories) {
            statement.execute("INSERT INTO Category (name) VALUES ('$cat')")
        }

        // Insert Products
        val products = listOf(
            Triple("Protein Bar Variety Pack", 26.49, 1),
            Triple("Granola Bars 64-count", 12.59, 1),
            Triple("Organic Ground Beef Pack", 129.99, 2),
            Triple("Japanese Wagyu Steak", 469.99, 2),
            Triple("OREO Sandwich Cookies", 18.99, 3),
            Triple("Frito Lay Classic Mix", 23.49, 3),
            Triple("Wild Alaska Salmon Portions", 169.99, 4),
            Triple("Alaska Dungeness Crab Clusters", 209.99, 4),
            Triple("Organic Applesauce", 12.99, 5),
            Triple("Organic Olive Oil 2L", 20.99, 5)
        )

        for ((name, price, catId) in products) {
            statement.execute("INSERT INTO Product (name, price, category_id) VALUES ('$name', $price, $catId)")
        }

        println("Database created and products inserted successfully!")

    } catch (e: SQLException) {
        e.printStackTrace()
    } finally {
        // Close resources
        statement?.close()
        conn?.close()
    }
}