# print(self.get_argument('question'))
#EG: 五月新增用户饼状图
# final_result = {"key": "return success"}
# question = self.get_argument('question')

import jieba.posseg as pseg
question = "五月新增用户饼状图"
# jieba_file = 'corpus.txt'
# jieba.load_userdict(jieba_file)
# words_dict = {}
#        seg_list = jieba.cut(question)
#         print("Default Mode: " + "/ ".join(seg_list))  # 精确模式
words = pseg.cut(question)
word_list = []
words_list = []
for word, flag in words:
    word_list = []
    word_list.append(word)
    word_list.append(flag)
    words_list.append(word_list)
print(words_list)
#words_list = [["前",[]],["我"]]
analyse_json = generate_api(words_list)
print(analyse_json)
print(nlpSqlData().queryRes(analyse_json)[0])
print(nlpSqlData().sqlStatement(analyse_json))
if nlpSqlData().queryRes(analyse_json)[1]:
    web_json = table_to_json(nlpSqlData().queryRes(analyse_json)[0].values, analyse_json['graph'][0])
    final_result = web_json
else:
    final_result = {"key": "error!"}
print(final_result)
self.write(final_result)