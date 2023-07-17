// const ArticleService = require("../services/ArticleService")
import ArticleService from "../services/ArticleService";
import { Request, Response, NextFunction } from "express";

class Article { 
  constructor() { 
  }

  async apiGetAllArticles(req: Request, res: Response, next: NextFunction) {
   console.log('yes we tried')
    try {
      const articles = await ArticleService.getAllArticles();
      if (!articles) {
        res.status(404).json("There are no article published yet!");
      }
      console.log(articles)
      res.json({
        success: true,
        data: articles,
      }); 
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
  }

  async apiGetArticleById(req: Request, res: Response, next: NextFunction) {
    try {
      let id = req.params.id || '';
      const article = await ArticleService.getArticlebyId(id);
      res.json({
        success: true,
        data: article,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
  }

  async apiCreateArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const createdArticle = await ArticleService.createArticle(req);
      res.json({
        success: true,
        data: createdArticle,
      });
    } catch (error) {
      console.log("error caught heres");
      console.log(error);
      res.status(500).json({ success: false, error: error });
    }
  }

  // static async apiUpdateArticle(req, res, next){
  //    try {
  //       const comment = {}
  //       comment.title        = req.body.title;
  //       comment.body         = req.body.body;
  //       comment.articleImage = req.body.article_image

  //       const updatedArticle = await ArticleService.updateArticle(comment);

  //       if(updatedArticle.modifiedCount === 0){
  //          throw new Error("Unable to update article, error occord");
  //       }

  //       res.json(updatedArticle);

  //    } catch (error) {
  //       res.status(500).json({error: error});
  //    }
  // }

  // static async apiDeleteArticle(req, res, next){
  //       try {
  //          const articleId = req.params.id;
  //          const deleteResponse =  await ArticleService.deleteArticle(articleId)
  //          res.json(deleteResponse);
  //       } catch (error) {
  //          res.status(500).json({error: error})
  //       }
  // }
}
export default new Article();
