"use client";
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Divider, List, Skeleton, Form } from "antd";
import { EditTodo, Todo } from "./interface";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { atomTodoLists } from "@/atom/todos.atom";
import ModalTodo from "../ModalTodo";

const fetchTodos = async ({ pageParam }) => {
  const res = await axios.get(`/api/todos?skip=${pageParam}`);
  return res.data;
};

export default function Index() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todo, setTodo] = useRecoilState<Todo[]>(atomTodoLists);

  const { data, error, fetchNextPage, isFetching, isLoading, hasNextPage } =
    useInfiniteQuery({
      initialPageParam: 0,
      queryKey: ["fetch_todos"],
      queryFn: async ({ pageParam }) => await fetchTodos({ pageParam }),
      getNextPageParam: (lastPage) => {
        return lastPage.offset + lastPage.limit >= lastPage.total
          ? undefined
          : lastPage.offset + lastPage.limit;
      },
    });

  useEffect(() => {
    if (data) {
      const todos = [];
      data?.pages?.forEach((page) => {
        page?.todos.forEach((todo) => {
          todos.push(todo);
        });
      });
      setTodo(todos);
    }
  }, [data]);

  const { mutate: deleteTodo, isPending: isPendingDelete } = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/api/todos/${id}`);
      if (res.status === 200) {
        removeTodo(id);
      }
      return res.data;
    },
  });

  const { mutate: completeTodo, isPending: isPendingComplete } = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.put(`/api/todos/complete/${id}`);
      if (res.status === 200) {
        removeTodo(id);
      }
      return res.data;
    },
  });

  const removeTodo = (id: number) => {
    setTodo((prev) => prev.filter((todo) => todo.id !== id));
  };

  const { mutate: editTodo, isPending: isPendingEdit } = useMutation({
    mutationFn: async ({ id, newData }: { id: number; newData: any }) => {
      const formData = new FormData();
      formData.append("title", newData.title);
      if (newData?.description) {
        formData.append("description", newData.description);
      }
      const res = await axios.put(`/api/todos/${id}`, formData);
      return res.data.data;
    },
    onSuccess: (data) => {
      setTodo((prev) => {
        const todo = prev.filter((todo) => todo.id !== data.id);
        const updatedTodo = {
          id: data.id,
          title: data.title,
          desc: data.desc,
          completed: data.completed,
          userId: data.user_id,
        };
        return [...todo, updatedTodo].sort((a, b) => a.id - b.id);
      });
    },
  });

  const handleEditTodo = (id: number) => {
    const todoTarget = todo.find((todo) => todo.id === id);
    form.setFieldsValue({
      id: todoTarget?.id,
      title: todoTarget?.title,
      description: todoTarget?.desc,
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      editTodo({
        id: values.id,
        newData: {
          title: values.title,
          desc: values.description,
        },
      });
      // reset edit
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onChange = (id) => {
    completeTodo(id);
  };

  const loadMoreData = async () => {
    await fetchNextPage();
  };

  return (
    <>
      <div
        id="scrollableDiv"
        className="w-full md:w-[414px] h-full md:h-[580px] mx-3 mt-4"
        style={{
          overflow: "auto",
          padding: "0 16px",
          border: "1px solid rgba(140, 140, 140, 0.35)",
        }}
      >
        <InfiniteScroll
          dataLength={todo.length}
          next={loadMoreData}
          hasMore={hasNextPage}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={
            hasNextPage || !data ? (
              <></>
            ) : (
              <Divider plain>It is all todo, nothing more 🤐</Divider>
            )
          }
          scrollableTarget="scrollableDiv"
        >
          <List
            loading={
              isPendingDelete || isPendingComplete || isPendingEdit || isLoading
            }
            dataSource={todo}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <Button
                    type="primary"
                    ghost
                    onClick={() => handleEditTodo(item.id)}
                    key="list-edit"
                    icon={<EditOutlined />}
                  ></Button>,
                  <Button
                    type="primary"
                    danger
                    ghost
                    onClick={() => deleteTodo(item.id)}
                    key="list-more"
                    icon={<DeleteOutlined />}
                  ></Button>,
                ]}
              >
                <Checkbox className="w-full" onChange={() => onChange(item.id)}>
                  <div className="flex flex-col">
                    <div>{item.title}</div>
                    <div>{item.desc}</div>
                  </div>
                </Checkbox>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
      <ModalTodo
        title="Edit Todo"
        form={form}
        isOpen={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
}
