#coding=utf-8
#!/usr/bin/python
import sys
import jieba
import jieba.posseg as pseg
#import pymysql
import pandas as pd
import time
import datetime
import calendar

import tornado.ioloop
import tornado.web

def FindTime(words_dict):
    time_flags_list = ['f','m','q','t','mq','nz','yf']
    last_flag = ""
    this_flag = ""
    full_words = []
    words_list = []
    for row in words_dict:
        this_flag = row[1]
        if this_flag in time_flags_list and last_flag not in time_flags_list:
#             print(row[0])
            words_list.append("".join(full_words))
            full_words = []
            full_words.append(row[0])
        if this_flag in time_flags_list and last_flag in time_flags_list:
            full_words.append(row[0])
#             print(word)
        last_flag = row[1]
    words_list.append("".join(full_words))
    words_list.remove('')
#     print(words_list)
    return words_list

def FindTarget(words_dict):
    target_flags_list = ['xzyh','n','vn']
    word_list =  []
    for row in words_dict:
        if row[1] in target_flags_list:
            word_list.append(row[0])
    if '充值' in word_list:
        word_list.remove('充值')
        word_list.insert(0,'充值')
    if '提现' in word_list:
        word_list.remove('提现')
        word_list.insert(0,'提现')
    return word_list

def FindGraph(words_dict):
    graph_word_list = []
    for row in words_dict:
#         print(flag)
        if row[1] == 'gt':
            graph_word_list.append(row[0])
    return graph_word_list

def FindGroup(words_dict):
    group_flags_list = ['uj','n']
    last_flag = ""
    this_flag = ""
    word_list = []
    last_word = ""
    this_word = ""
    for row in words_dict:
        this_flag = row[1]
        this_word = row[0]
        if this_flag == 'uj' and last_flag == 'n':
#             print("last"+last_word)
#             print("this"+this_word)
            word_list.append(last_word)
        last_word = row[0]
        last_flag = row[1]
#     if len(word_list) > 0:
#         word_list.remove(word_list[0])
    return word_list

def generate_api(words_dict):
    api_dict = {}
    api_dict["time"] = []
    api_dict["target"] = []
    api_dict["graph"] = []
    api_dict["groupBy"] = []
    api_dict["time"] = FindTime(words_dict)
    api_dict["target"] = FindTarget(words_dict)
    api_dict["graph"] = FindGraph(words_dict)
    api_dict["groupBy"] = FindGroup(words_dict)
    return api_dict

class nlpSqlData :
    def __init__(self):
        self.gbgIntMap = {"一" : 1,
               "二" : 2,
               "三" : 3,
               "四" : 4,
               "五" : 5,
               "六" : 6,
               "七" : 7,
               "八" : 8,
               "九" : 9,
               "十" : 10,
               "十一":11,
               "十二":12}
        self.tableMap = {"新增": "user1",
               "投资":"investment",
               "充值":"recharge"}
        self.fieldMap = {"金额": "money",
               "用户": "user_id",
               "地域": "city",
               "账户": "type"}
        self.groupByMap = {"账户" : "type",
                  "地域" : "city"}

    def timeParse(self, timeField):
        timeStartStamp = 0
        timeEndStamp = 0
        if (timeField[0][0]) == "前":
            timeInt = int(self.gbgIntMap.get(timeField[0][1:-1], timeField[0][1:-1]))
            timeEndStamp = time.mktime(datetime.datetime.now().timetuple())
            if timeField[0][-1] == "月" :
                currentTimeType = datetime.datetime.now().month
                timeStartStamp = time.mktime(datetime.datetime.now().replace(month = currentTimeType-timeInt).replace(day = 1).timetuple())
            elif timeField[0][-1] == "日":
                currentTimeType = datetime.datetime.now().day
                timeStartStamp = time.mktime(datetime.datetime.now().replace(day = currentTimeType-timeInt).timetuple())
            else:
                currentTimeType = datetime.datetime.now().year
                timeStartStamp = time.mktime(datetime.datetime.now().replace(year = currentTimeType-timeInt).replace(day = 1).timetuple())

        else:
            timeInt = int(self.gbgIntMap.get(timeField[0][0],timeField[0][0]))
            if timeField[0][1] == "月" :
                #currentTimeType = datetime.datetime.now().month
                weekDay,monthCountDay = calendar.monthrange(2019,timeInt)
                timeStartStamp = time.mktime(datetime.datetime.now().replace(month = timeInt).replace(day = 1).timetuple())
                timeEndStamp = time.mktime(datetime.datetime.now().replace(month = timeInt).replace(day = monthCountDay).timetuple()) + 3600 * 24
            elif timeField[0][1] == "日":
                #currentTimeType = datetime.datetime.now().day
                timeStartStamp = time.mktime(datetime.datetime.now().replace(day = timeInt).timetuple())
                timeEndStamp = timeStartStamp + 3600 * 24
            else:
            #年份暂时不涉及，逻辑不完整
                currentTimeType = datetime.datetime.now().year
                timeStartStamp = time.mktime(datetime.datetime.now().replace(day=timeInt).replace(day = 1).timetuple())
                timeEndStamp = timeStartStamp + 3600 * 24
        return timeStartStamp,timeEndStamp

    def tableParse(self,targetField):
        return self.tableMap.get(targetField[0], None)

    #print(tableParse(nlpRes["target"]))
    def fieldParse(self,targetField,groupByField,timeField):
        groupByListIn = [self.groupByMap.get(i,"") for i in groupByField]
        targetListIn = [self.fieldMap.get(i,"") for i in targetField]
        #return  targetListIn
        fieldList = []
        for i in targetListIn:
            if  i in groupByListIn:
                #targetListIn.remove(i)
                continue
            if "user_id" in i:
                i = "count({0})".format(i)
            elif i != "":
                i = "sum({0})".format(i)
            else:
                continue
            fieldList.append(i)
        #return fieldList

        """for i in range(1,len(targetField)):
            for key in self.fieldMap:
                if key in targetField[i]:
                    fieldStr = self.fieldMap.get(targetField[i],"")
                    break"""
        """if "user_id" in fieldStr :
            fieldStr = "count({0})".format(fieldStr)
        else:
            fieldStr = "sum({0})".format(fieldStr)"""

        groupByList = self.groupByParse(timeField,groupByField).replace("group by","").split(",")
        #return groupByList
        groupByListFinal = [groupByList[0] + ","+groupByList[1]] + groupByList[2:]
        groupByStr = "," + groupByListFinal[-1]
        fieldFinal = ",".join(list(set((",".join(fieldList) + groupByStr).split(","))))
        return ",".join(fieldList) + groupByStr
        #return fieldList

    def groupByParse(self,timeField,groupByField):
        groupByStr = ""
        if "日" in timeField[0] or "天" in timeField[0]:
            groupByStr = "group by from_unixtime(create_time,'%d')"
        elif "月" in timeField[0]:
            groupByStr = "group by from_unixtime(create_time,'%m')"
        else :
            groupByStr = "group by from_unixtime(create_time,'%y')"
        groupByStrListStr = [self.groupByMap.get(groupByField[i],"")  for i in range(len(groupByField))]

        groupByStrSec = ""
        for i in groupByStrListStr:
            if i != "":
                groupByStrSec = i
        #groupByStrSec = self.groupByMap.get(groupByField[0],"")
        groupByStrSecFinal ="" if groupByStrSec == "" else ( "," + groupByStrSec)
        #print(groupByParse(nlpRes["time"],nlpRes["groupBy"]))
        return groupByStr + groupByStrSecFinal

    def sqlStatement(self,nlpres):
        table = self.tableParse(nlpres["target"])
        field = self.fieldParse(nlpres["target"], nlpres["groupBy"], nlpres["time"])
        #return nlpres
        timeStart, timeEnd = self.timeParse(nlpres["time"])
        timeStr = "create_time >= {0:.0f} and create_time < {1:.0f}".format(timeStart,timeEnd)
        groupBy = self.groupByParse(nlpres["time"],nlpres["groupBy"])
        sqlBas = "select {0} from {1} where {2} {3}".format(field,table,timeStr,groupBy)
        return sqlBas

    def queryRes(self, nlpres):
        config = {}
        frame_empty = pd.DataFrame(columns=['A', 'B'])
        sql = self.sqlStatement(nlpres)
        print("sql:" + str(sql))
        db = pymysql.connect(database=config['mysql']['test']['database'], user=config['mysql']['test']['user_name'], password=config['mysql']['test']['password'], host=config['mysql']['test']['host'],port=config['mysql']['test']['port'])
        cursor = db.cursor()
        try:
            cursor.execute(sql)
        except Exception as e:
            return frame_empty, False, str(e)

        result = cursor.fetchall()
        columnDes = cursor.description
        columnNames = [columnDes[i][0] for i in range(len(columnDes))]
        frame = pd.DataFrame([list(i) for i in result], columns=columnNames)
        db.commit()
        cursor.close()
        db.close()
        return frame, True, ""

def table_to_json(table_list, table_type):
    result = {}
    if table_type == "热力图":
        result['graph_type'] = "hotdynamic_chart"
        result['table_result'] = []
        for row in table_list:
            result_dict = {}
            result_dict["name"] = str(row[1].replace('市',""))
            result_dict["value"] = str(row[0])
            result['table_result'].append(result_dict)

    elif table_type == "折线图":
        x_list = []
        y_list = []
        for row in table_list:
            x_list.append(str(row[1]))
            y_list.append(str(row[0]))
            result['graph_type'] = "line_chart"
            result['table_result'] = []
            result['table_result'].append(x_list)
            result['table_result'].append(y_list)
    elif table_type == "饼状图":
        result['graph_type'] = "pie_chart"
        result['table_result'] = []
        for row in table_list:
            result_dict = {}
            result_dict["value"] = str(row[0])
            result_dict["name"] = str(row[1])
            result['table_result'].append(result_dict)

    elif table_type == "柱状图":
        result['graph_type'] = "bar_chart"
        x_list = []
        y_list = []
        for row in table_list:
            x_list.append(str(row[2]))
            y_list.append(str(row[1]))
            result['table_result'] = []
            result['table_result'].append(x_list)
            result['table_result'].append(y_list)
    return result

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("get-get-get-get....")

class AjaxHandler(tornado.web.RequestHandler):

    def set_default_header(self):
        print("setting headers!!!")
        self.set_header('allow_origins', 'application/json; charset=UTF-8')
        self.set_header('Access-Control-Allow-Origin','*')
        self.set_header('Access-Control-Allow-Headers','Content-Type')

    def post(self):
        self.set_default_header()
        self.set_header('allow_origins', 'application/json; charset=UTF-8')
        print(self.get_argument('question').encode('utf-8'))
        #EG: 五月新增用户饼状图
        final_result = {"key": "return success"}
#         question = self.get_argument('question')
#         file_name = 'corpus.txt'
#         jieba.load_userdict(file_name)
#         words_dict = {}
# #        seg_list = jieba.cut(question)
# #         print("Default Mode: " + "/ ".join(seg_list))  # 精确模式
#         words = pseg.cut(question)
#         word_list = []
#         words_list = []
#         for word, flag in words:
#             word_list = []
#             word_list.append(word)
#             word_list.append(flag)
#             words_list.append(word_list)
#         print(words_list)
#         #words_list = [["前",[]],["我"]]
#         analyse_json = generate_api(words_list)
#         print(analyse_json)
#         print(nlpSqlData().queryRes(analyse_json)[0])
#         print(nlpSqlData().sqlStatement(analyse_json))
#         if nlpSqlData().queryRes(analyse_json)[1]:
#             web_json = table_to_json(nlpSqlData().queryRes(analyse_json)[0].values, analyse_json['graph'][0])
#             final_result = web_json
#         else:
#             final_result = {"key": "error!"}
        print(final_result)
        self.write(final_result)

application = tornado.web.Application([
    (r"/ana/ajax", AjaxHandler),
    ])

if __name__ == '__main__':
    application.listen(9890)
    tornado.ioloop.IOLoop.current().start()
