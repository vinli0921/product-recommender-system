from typing import List
from feast import FeatureStore
from models import Product, User

class FeastService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FeastService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self.store = FeatureStore('')
            self._initialized = True
    
    def load_items_exiting_user(self, user_id: int) -> List[Product]:
        suggested_item_ids = self.store.get_online_features(
            features=self.store.get_feature_service('user_top_k_items'),
            entity_rows=[{'user_id': user_id}]
        )
        
        top_item_ids = suggested_item_ids.to_df().iloc[0]['top_k_item_ids']
        
        suggested_item = self.store.get_online_features(
            features=self.store.get_feature_service('item_service'),
            entity_rows=[{'item_id': item_id}  for item_id in top_item_ids]
        ).to_df()
        return suggested_item
    
    def load_items_new_user(self, user: User): # TODO fix me
        # TODO finish logic
        pass
        
        # num_new_user = 1
        # k = 10
        # new_users = generate_users(num_new_user, num_users + 1)
        # new_users_embeddings = user_encoder(**data_preproccess(new_users))
        # top_k_items = []
        # for user_embed in new_users_embeddings:
        #     top_k = self.store.retrieve_online_documents(
        #         query=user_embed.tolist(),
        #         top_k=k,
        #         # feature=f'{item_embedding_view}:item_id'
        #         features=[f'{item_embedding_view}:item_id']
        #     )
        #     top_k_items.append(top_k.to_df())

        # new_users['top_k_items'] = top_k_items
        # new_users[['item_id', 'top_k_items']]

# Initilaize the service
feast_service = FeastService()