import { NextFunction, Request, Response } from 'express';
import collectionService from '../services/collection.service';

class CollectionController {
  async createCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const collection = await collectionService.createCollection(req.body);
      return (res as any).success(
        collection,
        'Collection created successfully',
        null,
        201
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to create collection',
        'CREATE_COLLECTION_ERROR',
        400
      );
    }
  }

  async getCollections(req: Request, res: Response, next: NextFunction) {
    try {
      const { isActive, featuredOnHomepage } = req.query;
      const filters: {
        isActive?: boolean;
        featuredOnHomepage?: boolean;
      } = {};

      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }

      if (featuredOnHomepage !== undefined) {
        filters.featuredOnHomepage = featuredOnHomepage === 'true';
      }

      const collections = await collectionService.getCollections(filters);
      return (res as any).success(
        collections,
        'Collections retrieved successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve collections',
        'GET_COLLECTIONS_ERROR',
        500
      );
    }
  }

  async getCollectionById(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) {
        id = id[0];
      }

      const collection = await collectionService.getCollectionById(id);

      if (!collection) {
        return (res as any).error(
          'Collection not found',
          'COLLECTION_NOT_FOUND',
          404
        );
      }

      return (res as any).success(
        collection,
        'Collection retrieved successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve collection',
        'GET_COLLECTION_ERROR',
        500
      );
    }
  }

  async getCollectionBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      let { slug } = req.params;
      if (Array.isArray(slug)) {
        slug = slug[0];
      }

      const collection = await collectionService.getCollectionBySlug(slug);

      if (!collection) {
        return (res as any).error(
          'Collection not found',
          'COLLECTION_NOT_FOUND',
          404
        );
      }

      return (res as any).success(
        collection,
        'Collection retrieved successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve collection',
        'GET_COLLECTION_ERROR',
        500
      );
    }
  }

  async updateCollection(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) {
        id = id[0];
      }

      const collection = await collectionService.updateCollection(id, req.body);

      if (!collection) {
        return (res as any).error(
          'Collection not found',
          'COLLECTION_NOT_FOUND',
          404
        );
      }

      return (res as any).success(
        collection,
        'Collection updated successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to update collection',
        'UPDATE_COLLECTION_ERROR',
        400
      );
    }
  }

  async deleteCollection(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) {
        id = id[0];
      }

      const success = await collectionService.deleteCollection(id);

      if (!success) {
        return (res as any).error(
          'Collection not found',
          'COLLECTION_NOT_FOUND',
          404
        );
      }

      return (res as any).success(null, 'Collection deleted successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to delete collection',
        'DELETE_COLLECTION_ERROR',
        500
      );
    }
  }

  async addProductToCollection(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) {
        id = id[0];
      }

      const { productId } = req.body;

      if (!productId) {
        return (res as any).error(
          'Product ID is required',
          'INVALID_INPUT',
          400
        );
      }

      const collection = await collectionService.addProductToCollection(
        id,
        productId
      );

      if (!collection) {
        return (res as any).error(
          'Collection not found',
          'COLLECTION_NOT_FOUND',
          404
        );
      }

      return (res as any).success(
        collection,
        'Product added to collection successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to add product to collection',
        'ADD_PRODUCT_ERROR',
        400
      );
    }
  }

  async removeProductFromCollection(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) {
        id = id[0];
      }

      const { productId } = req.body;

      if (!productId) {
        return (res as any).error(
          'Product ID is required',
          'INVALID_INPUT',
          400
        );
      }

      const collection = await collectionService.removeProductFromCollection(
        id,
        productId
      );

      if (!collection) {
        return (res as any).error(
          'Collection not found',
          'COLLECTION_NOT_FOUND',
          404
        );
      }

      return (res as any).success(
        collection,
        'Product removed from collection successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to remove product from collection',
        'REMOVE_PRODUCT_ERROR',
        400
      );
    }
  }

  async getCollectionProducts(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) {
        id = id[0];
      }

      const products = await collectionService.getCollectionProducts(id);

      return (res as any).success(
        products,
        'Collection products retrieved successfully'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve collection products',
        'GET_PRODUCTS_ERROR',
        500
      );
    }
  }
}

export default new CollectionController();
