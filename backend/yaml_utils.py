import os
import yaml
from typing import Any, List, Dict

def setup_and_load_yaml(filepath: str, key: str) -> List[Dict[str, Any]]:
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"YAML file not found: {filepath}")
    
    with open(filepath, 'r') as f:
        data = yaml.safe_load(f)

    if key not in data:
        raise KeyError(f"Key '{key}' not found in the YAML file")

    if not isinstance(data[key], list):
        raise TypeError(f"Expected a list for key '{key}' in the YAML file, but got {type(data[key])}")

    return data[key]
