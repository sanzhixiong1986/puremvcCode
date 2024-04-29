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
json�ļ򵥵Ĺ���
(1)key-valueģʽ;
(2)key, ���֣��ַ���;
(3)value, ����, �߼�����, ����, ����;
(4)����, true/false, null, [], {}
(5)��ߵĲ������object, {};
(6)JSON�ŵ�:
(1)ͨ�õĴ��䷽��; -->json�ı�-->�������, Lua, js, python...;
(2)XML, json XML�ŵ�,ʡ�ռ�;
(3)JSON�Ա� buf, �ɶ��Ժ�ǿ;
(7)�ڿɶ��Ժ�ǿ������£�ռ�ÿռ��С,ͨ�õı�����봫�䷽��;

*/

static char json_str[4096];
int main(int argc, char** argv) {
	// step1: ����һ��json_t����; --> JS object C�����ݽṹ;
	// json_t ��rootΪ������ڵ��һ����, json_t���ݽṹ;
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
	// step2: �����õ�json_t�������Լ���ص�����--> json�ı�;
	char* json_text;
	json_tree_to_string(root, &json_text); // �����������malloc json����Ҫ���ַ������ڴ�;
	printf("%s\n", json_text);
	strcpy(json_str, json_text);
	free(json_text);
	// ����json��,������ͬ���ĺ��Ӷ���һ������
	json_free_value(&root);
	root = NULL;
	// step3,�����json_t�ı�ר�����Ƕ�Ӧ��json����;
	json_parse_document(&root, json_str); // ����json�ı�����һ���µ�json������,
	// step4: ���Ǵ�json_t�����������ȡ�����ֵ;

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