"""
Gera api/_lib/schema.js a partir de build/schema.yml.

O YAML e a fonte unica da definicao dos campos: o servidor valida o conteudo
contra o modulo gerado e a interface desenha os formularios a partir do mesmo
lugar. Rode este script depois de editar build/schema.yml:

    python build/make-schema.py

Requer PyYAML.
"""

import io
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCE = ROOT / "build" / "schema.yml"
TARGET = ROOT / "api" / "_lib" / "schema.js"

# O painel usa o widget direto, entao estas chaves so adicionaria peso ao bundle.
DROP = {"required", "default", "value_type", "collapsed"}

try:
    import yaml
except ImportError:
    sys.exit("PyYAML nao encontrado: pip install pyyaml")


def clean(node):
    if isinstance(node, dict):
        return {key: clean(value) for key, value in node.items() if key not in DROP}
    if isinstance(node, list):
        return [clean(value) for value in node]
    return node


def main():
    config = yaml.safe_load(io.open(SOURCE, encoding="utf-8"))

    files = [
        {
            "id": entry["name"],
            "label": entry["label"],
            "path": entry["file"],
            "fields": entry["fields"],
        }
        for collection in config["collections"]
        for entry in collection["files"]
    ]

    header = [
        "/* Gerado por build/make-schema.py a partir de build/schema.yml.",
        "   Nao edite a mao: altere o YAML e rode o gerador de novo.",
        "*/",
        "",
        "export const schema = " + json.dumps(clean(files), ensure_ascii=False, indent=2) + ";",
        "",
        "export function findFile(id) {",
        "  return schema.find((file) => file.id === id) ?? null;",
        "}",
        "",
    ]

    TARGET.write_text("\n".join(header), encoding="utf-8", newline="\n")

    print(f"schema regerado: {TARGET.relative_to(ROOT)}")
    for entry in files:
        print(f"  {entry['id']:<18} {entry['path']:<28} {len(entry['fields'])} blocos")


if __name__ == "__main__":
    main()