import os
import logging
import traceback
from dotenv import load_dotenv
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder
from langchain.schema import SystemMessage
from langchain.memory import ConversationBufferWindowMemory
from langchain_groq import ChatGroq
from typing import List

from constants import AVAILABLE_MODELS, DEFAULT_MODEL, SYSTEM_PROMPT

# Disable parallelism in tokenizers
os.environ["TOKENIZERS_PARALLELISM"] = "false"

class ChatbotProcessor:
    def __init__(self):
        load_dotenv()
        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
        
        self.groq_api_key = os.getenv('GROQ_API_KEY')
        self.available_models = AVAILABLE_MODELS
        self.model_name = os.getenv('CHAT_MODEL_NAME', DEFAULT_MODEL)
        self._initialize_model()

        self.system_prompt = SYSTEM_PROMPT
        self.conversational_memory_length = 5
        self.memory = ConversationBufferWindowMemory(
            k=self.conversational_memory_length,
            memory_key="chat_history",
            return_messages=True
        )

    def _initialize_model(self):
        self.chat_model = ChatGroq(
            groq_api_key=self.groq_api_key,
            model_name=self.model_name,
            temperature=0.7
        )

    def set_model(self, model_name: str):
        if model_name not in self.available_models:
            raise ValueError(f"Model {model_name} not available. Available models: {', '.join(self.available_models)}")
        self.model_name = model_name
        self._initialize_model()
        logging.info(f"Model switched to: {model_name}")

    def get_current_model(self) -> str:
        return self.model_name

    def get_available_models(self) -> List[str]:
        return self.available_models

    def handle_query(self, query: str) -> str:
        try:
            chat_prompt = ChatPromptTemplate.from_messages(
                [
                    SystemMessage(content=self.system_prompt),
                    MessagesPlaceholder(variable_name="chat_history"),
                    HumanMessagePromptTemplate.from_template("{human_input}")
                ]
            )

            conversation = LLMChain(
                llm=self.chat_model,
                prompt=chat_prompt,
                verbose=False,
                memory=self.memory
            )

            response = conversation.predict(human_input=query)
            return response
        except Exception as e:
            logging.error(f"Error processing query: {e}")
            logging.error(traceback.format_exc())
            raise