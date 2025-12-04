import base64

def simple_encrypt(plain_text, key=23):
    """
    Encrypts a string using XOR + Base64 encoding.
    
    Args:
        plain_text (str): The original text to encrypt.
        key (int, optional): XOR key. Default is 23.
    
    Returns:
        str: Encrypted Base64 string.
    """
    # 1. XOR each character
    xor_text = ''.join(chr(ord(c) ^ key) for c in plain_text)
    
    # 2. Base64 encode
    encoded = base64.b64encode(xor_text.encode("utf-8")).decode("utf-8")
    return encoded


# Example usage
name = "SADAKU"
encrypted_name = simple_encrypt(name)
print("Encrypted Name:", encrypted_name)
