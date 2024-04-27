"use client";
import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import ModalTodo from "../ModalTodo";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { atomTodoLists } from "@/atom/todos.atom";

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setTodo = useSetRecoilState(atomTodoLists);
  const [form] = Form.useForm();

  const { mutate: addTodo } = useMutation({
    mutationFn: async (newTodo: any) => {
      const formData = new FormData();
      formData.append("title", newTodo.title);
      if (newTodo?.description) {
        formData.append("description", newTodo.description);
      }
      const res = await axios.post("/api/todos", formData);
      return res.data;
    },
    onSuccess: (data) => {
      if (data) {
        setTodo((prev) => {
          const newTodo = {
            id: data.data[0].id,
            title: data.data[0].title,
            desc: data.data[0].desc,
            completed: data.data[0].completed,
            userId: data.data[0].user_id,
          };
          return [...prev, newTodo];
        });
      }
    },
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      addTodo(values);
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button
        className="mt-4 !min-w-20 min-h-20 !text-2xl"
        type="primary"
        size="large"
        shape="circle"
        icon={<PlusOutlined />}
        onClick={showModal}
      />
      <ModalTodo
        title="Add Todo"
        form={form}
        isOpen={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
}
