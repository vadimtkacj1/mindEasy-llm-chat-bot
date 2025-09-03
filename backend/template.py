import logging
import traceback
import re

class Template:
    def __init__(self, tools):
        if not isinstance(tools, list) or not all(isinstance(tool, dict) for tool in tools):
            raise ValueError("tools must be a list of dictionaries")
        self.tools = tools

    def extract_field(self, field_name, query):
        # Enhance extraction logic to handle phrases and detect field names
        pattern = re.compile(rf'\b{field_name}\b', re.IGNORECASE)
        match = pattern.search(query)
        if match:
            return match.group(0)
        return None

    def generate_prompt(self, user_query):
        try:
            prompt = f"You received a query: {user_query}\n\n"

            if any(greet in user_query.lower() for greet in ["hi", "hello", "hey", "good morning", "good evening"]):
                prompt += "This is a general query. Greet the user politely and do not answer any questions outside of basic greetings.\n"
            else:
                prompt += "Respond with empathy and support. Here are the personality traits to follow:\n"
                for tool in self.tools:
                    tool_name = tool.get('name', 'Unnamed Tool')
                    tool_description = tool.get('description', 'No description available')
                    prompt += f"- {tool_name}: {tool_description}\n"
                
                prompt += "\nGenerate a response that aligns with the personality traits described above.\n"
            
            return prompt
        except Exception as e:
            logging.error(f"Error in generating prompt: {e}")
            logging.error(traceback.format_exc())
            raise