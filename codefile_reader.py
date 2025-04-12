import os

TEXT_BLOCK = 0
CODE_BLOCK = 1

open_tags = ('<textblock>', '<codeblock>')
close_tags = ('</textblock>', '</codeblock>')
code_files = os.listdir('code_files')[1:]


def get_code_file_names() -> list[str]:
    file_names = []
    for code_file in code_files:
        file_names.append(code_file.removesuffix('.code'))
    return file_names


def file_is_valid(file_lines: list[str]) -> bool:
    open_tag_stack = []
    for i in range(len(file_lines)):
        line = file_lines[i].strip()
        if line in open_tags:
            if len(open_tag_stack) == 1:
                return False
            open_tag_stack.append(line)
        else:
            if line == close_tags[0] and open_tag_stack.pop() != open_tags[0]:
                return False
            if line == close_tags[1] and open_tag_stack.pop() != open_tags[1]:
                return False
    
    return len(open_tag_stack) == 0


def load_code_file(code_file_name: str) -> list[tuple]:
    """
    returns a table of tuples representing the deconstructed parts of text
    from code_files/code_file_name.code
    code_file_name is excluding the extension.
    """
    code_file = open(f'code_files/{code_file_name}.code')
    file_lines = code_file.readlines()
    if not file_is_valid(file_lines):
        raise Exception('Invalid Codefile Detected: ' + code_file_name)
    
    parsed_contents = []
    last_open_tag = None
    tag_contents = ""
    for i in range(len(file_lines)):
        line = file_lines[i].strip()
        if line in open_tags:
            last_open_tag = line
            continue
        
        if line in close_tags:
            parsed_contents.append((close_tags.index(line), tag_contents))
            tag_contents = ""
            continue
        
        if last_open_tag:
            tag_contents += file_lines[i]
    
    return parsed_contents