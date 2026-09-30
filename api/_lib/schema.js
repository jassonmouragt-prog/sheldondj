/* Gerado por build/make-schema.py a partir de build/schema.yml.
   Nao edite a mao: altere o YAML e rode o gerador de novo.
*/

export const schema = [
  {
    "id": "global",
    "label": "Identidade e SEO",
    "path": "content/global.json",
    "fields": [
      {
        "label": "SEO",
        "name": "seo",
        "widget": "group",
        "fields": [
          {
            "label": "Título exibido no navegador",
            "name": "title",
            "widget": "string"
          },
          {
            "label": "Descrição para buscadores",
            "name": "description",
            "widget": "text"
          }
        ]
      },
      {
        "label": "Marca",
        "name": "brand",
        "widget": "group",
        "fields": [
          {
            "label": "Assinatura curta",
            "name": "tagline",
            "widget": "string"
          }
        ]
      },
      {
        "label": "Contato",
        "name": "contact",
        "widget": "group",
        "fields": [
          {
            "label": "Link do WhatsApp",
            "name": "whatsappHref",
            "widget": "string",
            "hint": "Endereço completo, começando por https://"
          }
        ]
      }
    ]
  },
  {
    "id": "sections-top",
    "label": "Topo do site",
    "path": "content/sections-top.json",
    "fields": [
      {
        "label": "Cabeçalho e menu",
        "name": "header",
        "widget": "group",
        "fields": [
          {
            "label": "Menu principal",
            "name": "nav",
            "widget": "list",
            "field": {
              "label": "Item",
              "name": "item",
              "widget": "object",
              "fields": [
                {
                  "label": "Texto",
                  "name": "label",
                  "widget": "string"
                },
                {
                  "label": "Link",
                  "name": "href",
                  "widget": "string"
                }
              ]
            }
          },
          {
            "label": "Menu do botão mobile",
            "name": "drawerNav",
            "widget": "list",
            "field": {
              "label": "Item",
              "name": "item",
              "widget": "object",
              "fields": [
                {
                  "label": "Texto",
                  "name": "label",
                  "widget": "string"
                },
                {
                  "label": "Link",
                  "name": "href",
                  "widget": "string"
                }
              ]
            }
          },
          {
            "label": "Texto do botão",
            "name": "ctaLabel",
            "widget": "string"
          },
          {
            "label": "Link do botão",
            "name": "ctaHref",
            "widget": "string"
          }
        ]
      },
      {
        "label": "Hero",
        "name": "hero",
        "widget": "group",
        "fields": [
          {
            "label": "Chamada pequena",
            "name": "eyebrow",
            "widget": "string"
          },
          {
            "label": "Linhas do título",
            "name": "titleLines",
            "widget": "list",
            "fields": [
              {
                "label": "Texto",
                "name": "text",
                "widget": "string"
              },
              {
                "label": "Pontuação no fim",
                "name": "dot",
                "widget": "string",
                "hint": "Opcional. Ex.: ponto . ou vírgula ,"
              }
            ]
          },
          {
            "label": "Texto de apoio",
            "name": "sub",
            "widget": "text"
          },
          {
            "label": "Texto do botão",
            "name": "ctaLabel",
            "widget": "string"
          },
          {
            "label": "Link do botão",
            "name": "ctaHref",
            "widget": "string"
          },
          {
            "label": "Texto do link",
            "name": "linkLabel",
            "widget": "string"
          },
          {
            "label": "Cidade",
            "name": "placeCity",
            "widget": "string"
          },
          {
            "label": "Desde",
            "name": "placeSince",
            "widget": "string"
          },
          {
            "label": "Foto principal",
            "name": "image",
            "widget": "image"
          },
          {
            "label": "Descrição da foto principal",
            "name": "imageAlt",
            "widget": "string"
          },
          {
            "label": "Selo sobre a foto",
            "name": "imageTag",
            "widget": "string"
          },
          {
            "label": "Foto secundária",
            "name": "imageSecondary",
            "widget": "image"
          },
          {
            "label": "Descrição da foto secundária",
            "name": "imageSecondaryAlt",
            "widget": "string"
          }
        ]
      },
      {
        "label": "Números da autoridade",
        "name": "authority",
        "widget": "group",
        "fields": [
          {
            "label": "Números",
            "name": "items",
            "widget": "list",
            "field": {
              "label": "Número",
              "name": "item",
              "widget": "object",
              "fields": [
                {
                  "label": "Texto antes",
                  "name": "prefix",
                  "widget": "string"
                },
                {
                  "label": "Número",
                  "name": "count",
                  "widget": "number"
                },
                {
                  "label": "Texto depois",
                  "name": "suffix",
                  "widget": "string"
                },
                {
                  "label": "Destacar o texto depois em itálico",
                  "name": "suffixItalic",
                  "widget": "boolean"
                },
                {
                  "label": "Usar ponto separador",
                  "name": "dot",
                  "widget": "boolean"
                },
                {
                  "label": "Rótulo abaixo",
                  "name": "label",
                  "widget": "string"
                }
              ]
            }
          }
        ]
      },
      {
        "label": "Conceito",
        "name": "concept",
        "widget": "group",
        "fields": [
          {
            "label": "Chamada pequena",
            "name": "eyebrow",
            "widget": "string"
          },
          {
            "label": "Linhas do título",
            "name": "titleLines",
            "widget": "list",
            "field": {
              "label": "Linha",
              "name": "text",
              "widget": "string"
            }
          },
          {
            "label": "Texto de apoio",
            "name": "lead",
            "widget": "text"
          },
          {
            "label": "Texto do bloco",
            "name": "body",
            "widget": "text"
          },
          {
            "label": "Foto",
            "name": "image",
            "widget": "image"
          },
          {
            "label": "Descrição da foto",
            "name": "imageAlt",
            "widget": "string"
          }
        ]
      }
    ]
  },
  {
    "id": "sections-mid",
    "label": "Seções centrais",
    "path": "content/sections-mid.json",
    "fields": [
      {
        "label": "Serviços",
        "name": "services",
        "widget": "group",
        "fields": [
          {
            "label": "Chamada pequena",
            "name": "eyebrow",
            "widget": "string"
          },
          {
            "label": "Linhas do título",
            "name": "titleLines",
            "widget": "list",
            "field": {
              "label": "Linha",
              "name": "text",
              "widget": "string"
            }
          },
          {
            "label": "Texto de apoio",
            "name": "intro",
            "widget": "text"
          },
          {
            "label": "Serviços",
            "name": "items",
            "widget": "list",
            "field": {
              "label": "Serviço",
              "name": "item",
              "widget": "object",
              "fields": [
                {
                  "label": "Estilo visual",
                  "name": "variant",
                  "widget": "select",
                  "options": [
                    {
                      "label": "Iluminação",
                      "value": "illum"
                    },
                    {
                      "label": "Painel de LED",
                      "value": "led"
                    },
                    {
                      "label": "Som",
                      "value": "som"
                    },
                    {
                      "label": "DJ",
                      "value": "dj"
                    },
                    {
                      "label": "Piso de vidro",
                      "value": "piso"
                    },
                    {
                      "label": "Palco",
                      "value": "palco"
                    },
                    {
                      "label": "Estrutura",
                      "value": "estrutura"
                    }
                  ]
                },
                {
                  "label": "Nome",
                  "name": "name",
                  "widget": "string"
                },
                {
                  "label": "Chamada curta",
                  "name": "tag",
                  "widget": "string"
                },
                {
                  "label": "Foto",
                  "name": "image",
                  "widget": "image"
                },
                {
                  "label": "Descrição da foto",
                  "name": "imageAlt",
                  "widget": "string"
                }
              ]
            }
          },
          {
            "label": "Vídeos em destaque",
            "name": "videos",
            "widget": "list",
            "field": {
              "label": "Vídeo",
              "name": "item",
              "widget": "object",
              "fields": [
                {
                  "label": "Selo do botão",
                  "name": "badge",
                  "widget": "string"
                },
                {
                  "label": "Título",
                  "name": "title",
                  "widget": "string"
                },
                {
                  "label": "Pontuação no fim",
                  "name": "dot",
                  "widget": "string"
                },
                {
                  "label": "Texto",
                  "name": "body",
                  "widget": "text"
                },
                {
                  "label": "Arquivo de vídeo",
                  "name": "video",
                  "widget": "file"
                },
                {
                  "label": "Imagem de capa",
                  "name": "poster",
                  "widget": "image"
                },
                {
                  "label": "Texto do vídeo para leitores de tela",
                  "name": "videoLabel",
                  "widget": "string"
                },
                {
                  "label": "Texto do link",
                  "name": "ctaLabel",
                  "widget": "string"
                },
                {
                  "label": "Link",
                  "name": "ctaHref",
                  "widget": "string"
                }
              ]
            }
          }
        ]
      },
      {
        "label": "Vídeos em retrato",
        "name": "reels",
        "widget": "group",
        "fields": [
          {
            "label": "Linhas do título",
            "name": "titleLines",
            "widget": "list",
            "field": {
              "label": "Linha",
              "name": "text",
              "widget": "string"
            }
          },
          {
            "label": "Texto de apoio",
            "name": "intro",
            "widget": "text"
          },
          {
            "label": "Vídeos",
            "name": "items",
            "widget": "list",
            "field": {
              "label": "Vídeo",
              "name": "item",
              "widget": "object",
              "fields": [
                {
                  "label": "Selo",
                  "name": "badge",
                  "widget": "string"
                },
                {
                  "label": "Título",
                  "name": "title",
                  "widget": "string"
                },
                {
                  "label": "Arquivo de vídeo",
                  "name": "video",
                  "widget": "file"
                },
                {
                  "label": "Imagem de capa",
                  "name": "poster",
                  "widget": "image"
                },
                {
                  "label": "Texto do vídeo para leitores de tela",
                  "name": "videoLabel",
                  "widget": "string"
                },
                {
                  "label": "Texto do botão de play",
                  "name": "playLabel",
                  "widget": "string"
                }
              ]
            }
          }
        ]
      },
      {
        "label": "Destaques",
        "name": "features",
        "widget": "group",
        "fields": [
          {
            "label": "Destaques",
            "name": "items",
            "widget": "list",
            "field": {
              "label": "Destaque",
              "name": "item",
              "widget": "object",
              "fields": [
                {
                  "label": "Inverter o lado da imagem",
                  "name": "invert",
                  "widget": "string",
                  "hidden": true
                },
                {
                  "label": "Chamada pequena",
                  "name": "eyebrow",
                  "widget": "string"
                },
                {
                  "label": "Título",
                  "name": "title",
                  "widget": "text",
                  "hint": "Use Enter para quebrar a linha"
                },
                {
                  "label": "Texto",
                  "name": "body",
                  "widget": "text"
                },
                {
                  "label": "Linha de detalhes",
                  "name": "meta",
                  "widget": "string"
                },
                {
                  "label": "Foto",
                  "name": "image",
                  "widget": "image"
                },
                {
                  "label": "Descrição da foto",
                  "name": "imageAlt",
                  "widget": "string"
                }
              ]
            }
          }
        ]
      },
      {
        "label": "Eventos",
        "name": "portfolio",
        "widget": "group",
        "fields": [
          {
            "label": "Chamada pequena",
            "name": "eyebrow",
            "widget": "string"
          },
          {
            "label": "Linhas do título",
            "name": "titleLines",
            "widget": "list",
            "fields": [
              {
                "label": "Texto",
                "name": "text",
                "widget": "string"
              },
              {
                "label": "Pontuação no fim",
                "name": "dot",
                "widget": "string"
              }
            ]
          },
          {
            "label": "Etiquetas",
            "name": "chips",
            "widget": "list",
            "field": {
              "label": "Etiqueta",
              "name": "text",
              "widget": "string"
            }
          },
          {
            "label": "Eventos",
            "name": "items",
            "widget": "list",
            "field": {
              "label": "Evento",
              "name": "item",
              "widget": "object",
              "fields": [
                {
                  "label": "Estilo visual",
                  "name": "variant",
                  "widget": "select",
                  "options": [
                    {
                      "label": "Corporativo",
                      "value": "corp"
                    },
                    {
                      "label": "15 anos",
                      "value": "quinze"
                    },
                    {
                      "label": "Casamento",
                      "value": "casa"
                    },
                    {
                      "label": "Aniversário",
                      "value": "aniversario"
                    },
                    {
                      "label": "Formatura",
                      "value": "formatura"
                    },
                    {
                      "label": "Festa",
                      "value": "festas"
                    }
                  ]
                },
                {
                  "label": "Nome",
                  "name": "name",
                  "widget": "string"
                },
                {
                  "label": "Linha de detalhe",
                  "name": "meta",
                  "widget": "string"
                },
                {
                  "label": "Frase curta",
                  "name": "services",
                  "widget": "string"
                },
                {
                  "label": "Link",
                  "name": "href",
                  "widget": "string"
                },
                {
                  "label": "Foto",
                  "name": "image",
                  "widget": "image"
                },
                {
                  "label": "Descrição da foto",
                  "name": "imageAlt",
                  "widget": "string"
                }
              ]
            }
          }
        ]
      },
      {
        "label": "Transição",
        "name": "transition",
        "widget": "group",
        "fields": [
          {
            "label": "Linhas do título",
            "name": "titleLines",
            "widget": "list",
            "fields": [
              {
                "label": "Texto",
                "name": "text",
                "widget": "string"
              },
              {
                "label": "Pontuação no fim",
                "name": "dot",
                "widget": "string"
              }
            ]
          },
          {
            "label": "Foto",
            "name": "image",
            "widget": "image"
          },
          {
            "label": "Descrição da foto",
            "name": "imageAlt",
            "widget": "string"
          }
        ]
      }
    ]
  },
  {
    "id": "sections-bottom",
    "label": "Base e rodapé",
    "path": "content/sections-bottom.json",
    "fields": [
      {
        "label": "História",
        "name": "history",
        "widget": "group",
        "fields": [
          {
            "label": "Linhas do título",
            "name": "titleLines",
            "widget": "list",
            "field": {
              "label": "Linha",
              "name": "text",
              "widget": "string"
            }
          },
          {
            "label": "Rótulo do bloco",
            "name": "noteLabel",
            "widget": "string"
          },
          {
            "label": "Texto do bloco",
            "name": "note",
            "widget": "text"
          }
        ]
      },
      {
        "label": "Cases",
        "name": "cases",
        "widget": "group",
        "fields": [
          {
            "label": "Chamada pequena",
            "name": "eyebrow",
            "widget": "string"
          },
          {
            "label": "Linhas do título",
            "name": "titleLines",
            "widget": "list",
            "field": {
              "label": "Linha",
              "name": "text",
              "widget": "string"
            }
          },
          {
            "label": "Cases",
            "name": "items",
            "widget": "list",
            "field": {
              "label": "Case",
              "name": "item",
              "widget": "object",
              "fields": [
                {
                  "label": "Inverter o lado da imagem",
                  "name": "invert",
                  "widget": "string",
                  "hidden": true
                },
                {
                  "label": "Selo",
                  "name": "badge",
                  "widget": "string"
                },
                {
                  "label": "Título",
                  "name": "title",
                  "widget": "string"
                },
                {
                  "label": "Linha de detalhe",
                  "name": "meta",
                  "widget": "string"
                },
                {
                  "label": "Serviços",
                  "name": "services",
                  "widget": "list",
                  "field": {
                    "label": "Serviço",
                    "name": "text",
                    "widget": "string"
                  }
                },
                {
                  "label": "Foto",
                  "name": "image",
                  "widget": "image"
                },
                {
                  "label": "Descrição da foto",
                  "name": "imageAlt",
                  "widget": "string"
                }
              ]
            }
          }
        ]
      },
      {
        "label": "Pacotes",
        "name": "packages",
        "widget": "group",
        "fields": [
          {
            "label": "Chamada pequena",
            "name": "eyebrow",
            "widget": "string"
          },
          {
            "label": "Linhas do título",
            "name": "titleLines",
            "widget": "list",
            "field": {
              "label": "Linha",
              "name": "text",
              "widget": "string"
            }
          },
          {
            "label": "Texto de apoio",
            "name": "intro",
            "widget": "text"
          },
          {
            "label": "Pacotes",
            "name": "items",
            "widget": "list",
            "field": {
              "label": "Pacote",
              "name": "item",
              "widget": "object",
              "fields": [
                {
                  "label": "Número",
                  "name": "badge",
                  "widget": "string"
                },
                {
                  "label": "Nome",
                  "name": "title",
                  "widget": "string"
                },
                {
                  "label": "Selo",
                  "name": "tag",
                  "widget": "string"
                },
                {
                  "label": "Para quem é",
                  "name": "forWho",
                  "widget": "text"
                },
                {
                  "label": "Rótulo da lista",
                  "name": "includesLabel",
                  "widget": "string"
                },
                {
                  "label": "O que inclui",
                  "name": "includes",
                  "widget": "list",
                  "field": {
                    "label": "Item",
                    "name": "text",
                    "widget": "string"
                  }
                },
                {
                  "label": "Capacidade",
                  "name": "capacityLabel",
                  "widget": "string"
                },
                {
                  "label": "Detalhe da capacidade",
                  "name": "capacityText",
                  "widget": "string"
                },
                {
                  "label": "Texto do botão",
                  "name": "ctaLabel",
                  "widget": "string"
                },
                {
                  "label": "Link do botão",
                  "name": "ctaHref",
                  "widget": "string"
                },
                {
                  "label": "Aparência do botão",
                  "name": "ctaStyle",
                  "widget": "select",
                  "options": [
                    {
                      "label": "Contorno escuro",
                      "value": "btn btn-ghost-dark"
                    },
                    {
                      "label": "Preenchido escuro",
                      "value": "btn btn-primary-dark"
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "label": "Sob medida",
        "name": "custom",
        "widget": "group",
        "fields": [
          {
            "label": "Chamada pequena",
            "name": "eyebrow",
            "widget": "string"
          },
          {
            "label": "Linhas do título",
            "name": "titleLines",
            "widget": "list",
            "field": {
              "label": "Linha",
              "name": "text",
              "widget": "string"
            }
          },
          {
            "label": "Palavra em destaque",
            "name": "sub",
            "widget": "string"
          },
          {
            "label": "Texto",
            "name": "body",
            "widget": "text"
          },
          {
            "label": "Texto do botão",
            "name": "ctaLabel",
            "widget": "string"
          },
          {
            "label": "Link do botão",
            "name": "ctaHref",
            "widget": "string"
          },
          {
            "label": "Foto",
            "name": "image",
            "widget": "image"
          },
          {
            "label": "Descrição da foto",
            "name": "imageAlt",
            "widget": "string"
          }
        ]
      },
      {
        "label": "Depoimentos",
        "name": "testimonials",
        "widget": "group",
        "fields": [
          {
            "label": "Chamada pequena",
            "name": "eyebrow",
            "widget": "string"
          },
          {
            "label": "Linhas do título",
            "name": "titleLines",
            "widget": "list",
            "fields": [
              {
                "label": "Texto",
                "name": "text",
                "widget": "string"
              },
              {
                "label": "Pontuação no fim",
                "name": "dot",
                "widget": "string"
              }
            ]
          },
          {
            "label": "Depoimentos",
            "name": "items",
            "widget": "list",
            "field": {
              "label": "Depoimento",
              "name": "item",
              "widget": "object",
              "fields": [
                {
                  "label": "Destacar este depoimento",
                  "name": "featured",
                  "widget": "string",
                  "hidden": true
                },
                {
                  "label": "Texto",
                  "name": "quote",
                  "widget": "text"
                },
                {
                  "label": "Nome",
                  "name": "name",
                  "widget": "string"
                },
                {
                  "label": "Contexto",
                  "name": "context",
                  "widget": "string"
                },
                {
                  "label": "Selo",
                  "name": "badge",
                  "widget": "string"
                }
              ]
            }
          }
        ]
      },
      {
        "label": "Chamada final",
        "name": "finalCta",
        "widget": "group",
        "fields": [
          {
            "label": "Linhas do título",
            "name": "titleLines",
            "widget": "list",
            "field": {
              "label": "Linha",
              "name": "text",
              "widget": "string"
            }
          },
          {
            "label": "Linha de cima da assinatura",
            "name": "signTop",
            "widget": "string"
          },
          {
            "label": "Linha de baixo da assinatura",
            "name": "signBottom",
            "widget": "string"
          },
          {
            "label": "Lista",
            "name": "list",
            "widget": "list",
            "field": {
              "label": "Item",
              "name": "text",
              "widget": "string"
            }
          },
          {
            "label": "Texto",
            "name": "body",
            "widget": "text"
          },
          {
            "label": "Texto do botão",
            "name": "ctaLabel",
            "widget": "string"
          },
          {
            "label": "Link do botão",
            "name": "ctaHref",
            "widget": "string"
          },
          {
            "label": "Foto",
            "name": "image",
            "widget": "image"
          },
          {
            "label": "Descrição da foto",
            "name": "imageAlt",
            "widget": "string"
          }
        ]
      },
      {
        "label": "Rodapé",
        "name": "footer",
        "widget": "group",
        "fields": [
          {
            "label": "Texto do rodapé",
            "name": "description",
            "widget": "text"
          },
          {
            "label": "Rótulo do menu",
            "name": "navLabel",
            "widget": "string"
          },
          {
            "label": "Menu",
            "name": "nav",
            "widget": "list",
            "field": {
              "label": "Item",
              "name": "item",
              "widget": "object",
              "fields": [
                {
                  "label": "Texto",
                  "name": "label",
                  "widget": "string"
                },
                {
                  "label": "Link",
                  "name": "href",
                  "widget": "string"
                }
              ]
            }
          },
          {
            "label": "Rótulo das redes",
            "name": "socialLabel",
            "widget": "string"
          },
          {
            "label": "Redes",
            "name": "social",
            "widget": "list",
            "field": {
              "label": "Rede",
              "name": "item",
              "widget": "object",
              "fields": [
                {
                  "label": "Texto",
                  "name": "label",
                  "widget": "string"
                },
                {
                  "label": "Link",
                  "name": "href",
                  "widget": "string"
                },
                {
                  "label": "Ícone",
                  "name": "iconPath",
                  "widget": "string",
                  "hidden": true
                }
              ]
            }
          },
          {
            "label": "Rótulo do local",
            "name": "localLabel",
            "widget": "string"
          },
          {
            "label": "Cidade",
            "name": "city",
            "widget": "string"
          },
          {
            "label": "Desde",
            "name": "since",
            "widget": "string"
          },
          {
            "label": "Copyright",
            "name": "copyright",
            "widget": "string"
          },
          {
            "label": "Slogan",
            "name": "slogan",
            "widget": "string"
          }
        ]
      }
    ]
  }
];

export function findFile(id) {
  return schema.find((file) => file.id === id) ?? null;
}
