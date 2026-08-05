import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { homeworkTaskSchema } from '../../utils/validation'

function AddTaskForm({ onAdd }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(homeworkTaskSchema),
    defaultValues: { title: '', subject: '', due_date: '' },
  })

  async function onSubmit(values) {
    await onAdd({ ...values, due_date: values.due_date || null })
    reset()
  }

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid sm:grid-cols-[1fr_1fr_auto_auto] gap-3 items-start">
        <Input placeholder="Task title" error={errors.title?.message} {...register('title')} />
        <Input placeholder="Subject" error={errors.subject?.message} {...register('subject')} />
        <Input type="date" aria-label="Due date" {...register('due_date')} />
        <Button type="submit" loading={isSubmitting} icon={PlusCircle} className="sm:w-auto w-full">
          Add task
        </Button>
      </form>
    </Card>
  )
}

export default AddTaskForm
