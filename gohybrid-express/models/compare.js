const db = require('./conn');

class Compare {
   constructor(id, user_id, html) {
      this.id = id;
      this.user_id = user_id;
      this.html = html;
   }

   static async getAllComparisons(uid) {
      try {
         const response = db.any(`
                SELECT * FROM comparisons
                WHERE user_id = $1`,
            [uid]
         );
         return response;
      } catch (err) {
         return err.message
      }
   }

   static async removeComparison(id) {
      try {
         const response = db.result(`
                DELETE FROM comparisons
                WHERE id = $1`,
            [id]
         );
         return response;
      } catch (err) {
         return err.message
      }
   }

   async addCompare() {
      try {
         const response = db.result(`
                INSERT INTO comparisons
                    (user_id, html)
                VALUES($1,$2)`,
            [this.user_id, this.html]
         )
         return response;
      } catch (err) {
         return err.message
      }
   }
}

module.exports = Compare;