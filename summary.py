"""Python implementation of the TextRank algoritm.
"""
import editdistance
import io
import itertools
import networkx as nx
import nltk
from fpdf import FPDF
import textwrap

def setup_environment():
    """Download required resources."""
    nltk.download('punkt')
    nltk.download('averaged_perceptron_tagger')
    print('Completed resource downloads.')


def filter_for_tags(tagged, tags=['NN', 'JJ', 'NNP']):
    return [item for item in tagged if item[1] in tags]


def normalize(tagged):
    return [(item[0].replace('.', ''), item[1]) for item in tagged]


def unique_everseen(iterable, key=None):
    seen = set()
    seen_add = seen.add
    if key is None:
        def key(x): return x
    for element in iterable:
        k = key(element)
        if k not in seen:
            seen_add(k)
            yield element


def build_graph(nodes):
    gr = nx.Graph()  # initialize an undirected graph
    gr.add_nodes_from(nodes)
    nodePairs = list(itertools.combinations(nodes, 2))
    for pair in nodePairs:
        firstString = pair[0]
        secondString = pair[1]
        levDistance = editdistance.eval(firstString, secondString)
        gr.add_edge(firstString, secondString, weight=levDistance)

    return gr


def extract_key_phrases(text):
    word_tokens = nltk.word_tokenize(text)
    tagged = nltk.pos_tag(word_tokens)
    textlist = [x[0] for x in tagged]

    tagged = filter_for_tags(tagged)
    tagged = normalize(tagged)

    unique_word_set = unique_everseen([x[0] for x in tagged])
    word_set_list = list(unique_word_set)
    graph = build_graph(word_set_list)
    calculated_page_rank = nx.pagerank(graph, weight='weight')
    keyphrases = sorted(calculated_page_rank, key=calculated_page_rank.get,
                        reverse=True)
    one_third = len(word_set_list) // 3
    keyphrases = keyphrases[0:one_third + 1]
    modified_key_phrases = set([])

    i = 0
    while i < len(textlist):
        w = textlist[i]
        if w in keyphrases:
            phrase_ws = [w]
            i += 1
            while i < len(textlist) and textlist[i] in keyphrases:
                phrase_ws.append(textlist[i])
                i += 1

            phrase = ' '.join(phrase_ws)
            if phrase not in modified_key_phrases:
                modified_key_phrases.add(phrase)
        else:
            i += 1
    return modified_key_phrases


def extract_sentences(text, summary_length=100, clean_sentences=True, language='english'):
    sent_detector = nltk.data.load('tokenizers/punkt/'+language+'.pickle')
    sentence_tokens = sent_detector.tokenize(text.strip())
    graph = build_graph(sentence_tokens)

    calculated_page_rank = nx.pagerank(graph, weight='weight')

    # most important sentences in ascending order of importance
    sentences = sorted(calculated_page_rank, key=calculated_page_rank.get,
                       reverse=True)
    len_to_ret = int(len(sentences)*summary_length)
    # return  word summary
    summary = ' '.join(sentences[:len_to_ret])
    summary_words = summary.split()
    #summary_words = summary_words[0:summary_length]
    dot_indices = [idx for idx, word in enumerate(summary_words) if word.find('.') != -1]
    if clean_sentences and dot_indices:
        last_dot = max(dot_indices) + 1
        summary = ' '.join(summary_words[0:last_dot])
    else:
        summary = ' '.join(summary_words)
    return summary

def create_pdf(text, filename):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_xy(0, 0)
    pdf.set_font('arial', 'B', 13.0)
    for lines in text:
        pdf.cell(ln=0, h=5.0, align='L', w=0, txt=lines, border=0)
    pdf.output(filename, 'F')

def summarize_all(input_text, percentage_of_summary):
    summary_size = int(percentage_of_summary*len(input_text))
    keyphrases = extract_key_phrases(input_text)
    summary = extract_sentences(input_text, summary_length=summary_size)
    for key_phrase in keyphrases:
        summary = summary + '\n'+key_phrase
    
    
    #create_pdf(summary, 'summary.pdf')
    return summary 


def main(input_text, percentage_of_summary):
    a = summarize_all(input_text, percentage_of_summary)
    return a

if __name__ == "main":
    main()

