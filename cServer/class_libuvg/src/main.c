#include <stdio.h>
#include <string.h>
#include <stdlib.h>

//#include "./../3rd/mjson/json.h"
#include "myjson/json.h"

/*
{
"uid" : 123,
"uname" : "hello!",
"is_new": true,
"vip": null,

"man_prop": [1, "hello", "2"],
"weap_prop": {
"default": "putongzidan",
},
}
*/

/*
json的简单的规则
(1)key-value模式;
(2)key, 数字，字符串;
(3)value, 数字, 逻辑变量, 数组, 对象;
(4)数字, true/false, null, [], {}
(5)最高的层次上面object, {};
(6)JSON优点:
(1)通用的传输方案; -->json文本-->解码回来, Lua, js, python...;
(2)XML, json XML优点,省空间;
(3)JSON对比 buf, 可读性很强;
(7)在可读性很强的情况下，占用空间较小,通用的编码解码传输方案;

*/

static char json_str[4096];
int main(int argc, char** argv) {
	// step1: 建立一个json_t对象; --> JS object C的数据结构;
	// json_t 以root为这个根节点的一颗树, json_t数据结构;
	json_t* root = json_new_object(); // {}
	json_t* number = json_new_number("123"); // 
	json_insert_pair_into_object(root, "uid", number); // {uid: 123,}

	json_t* str = json_new_string("hello!");
	json_insert_pair_into_object(root, "uname", str);

	json_t* b_true = json_new_true();
	json_insert_pair_into_object(root, "is_new", b_true);

	json_t* j_null = json_new_null();
	json_insert_pair_into_object(root, "vip", j_null);

	// []
	json_t* j_array = json_new_array();
	json_insert_pair_into_object(root, "man_prop", j_array);
	number = json_new_number("1");
	json_insert_child(j_array, number);

	str = json_new_string("hello");
	json_insert_child(j_array, str);

	str = json_new_string("2");
	json_insert_child(j_array, str);
	// array end 

	// {}
	json_t* j_object = json_new_object();
	json_insert_pair_into_object(root, "weap_prop", j_object);

	str = json_new_string("putongzidan");
	json_insert_pair_into_object(j_object, "default", str);
	// {} end
	// step2: 建立好的json_t对象树以及相关的依赖--> json文本;
	char* json_text;
	json_tree_to_string(root, &json_text); // 这个函数，来malloc json所需要的字符串的内存;
	printf("%s\n", json_text);
	strcpy(json_str, json_text);
	free(json_text);
	// 销毁json树,他会连同他的孩子对象一起销毁
	json_free_value(&root);
	root = NULL;
	// step3,将这个json_t文本专成我们对应的json对象;
	json_parse_document(&root, json_str); // 根据json文本产生一颗新的json对象树,
	// step4: 我们从json_t对象树里面获取里面的值;

	json_t* key = json_find_first_label(root, "uname");
	if (key) {
		json_t* value = key->child;
		switch (value->type) {
		case JSON_STRING:
			printf("key: %s value: %s\n", key->text, value->text);
			break;
		}
	}

	key = json_find_first_label(root, "uid");
	if (key) {
		json_t* value = key->child;
		switch (value->type) {
		case JSON_NUMBER:
			printf("key: %s value: %f\n", key->text, atof(value->text));
			break;
		}
	}

	json_free_value(&root);

	system("pause");
	return 0;
}