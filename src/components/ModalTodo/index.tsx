"use client";
import React, { useEffect, useState } from "react";
import { Modal, Form, Input } from "antd";
import { Props } from "./interface";
export default function ModalTodo({
  title,
  form,
  isOpen,
  onOk,
  onCancel,
}: Props) {
  return (
    <>
      <Modal title={title} open={isOpen} onOk={onOk} onCancel={onCancel}>
        <Form form={form}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
          </Form.Item>
          <Form.Item name="id" noStyle>
            <Input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
